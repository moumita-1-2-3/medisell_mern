import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/apiError.js';
import {User} from '../models/user.model.js';
import {uploadOnCloudinary} from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/apiResponse.js';
import jwt from 'jsonwebtoken';
const registerUser = asyncHandler(async (req, res) => {
    const {username, email, fullname, password} = req.body;
    console.log(username, email, fullname, password)
    if(
        [username, email, fullname, password].some((field) => field?.trim() === "")
    ){
        throw new ApiError(400, "Require more data")
    }
    console.log("User data is valid")
    const existedUser =await User.findOne({
        $or: [{ username }, { email }]
    })
    if(existedUser){
        throw new ApiError(409, "User already exists")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    let coverLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverLocalPath = req.files?.coverImage[0]?.path;
    }
    console.log(avatarLocalPath)
    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar and Cover are required")
    }

    //upload to cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverLocalPath)

    if (!avatar){
        throw new ApiError(400, "avatar upload failed")
    }
    const user = await User.create({
        username: username.toLowerCase(),
        email,
        fullname,
        password,
        avatar: avatar.url,
        coverImage: coverImage?.url || ""
    })
    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if(!createdUser){
        throw new ApiError(500, "User not created")
    }

    return res.status(201).json(new ApiResponse(201, createdUser, "User created successfully"))
})

const generateAccessAndRefreshToken = async(userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({
            validateBeforeSave: false
        })
        return {accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(500, "Token generation failed")
    }
}
const loginUser = asyncHandler(async (req, res) => {
    const {email, username, password} = req.body;
    if(!(email || username)){
        throw new ApiError(400, "Email or Username is required")
    }
    const user = await User.findOne({
        $or: [{email}, {username}]
    })
    if(!user){
        throw new ApiError(404, "User not found")
    }
    const isPasswordValid = await user.isPasswordCorrect(password)
    if(!isPasswordValid){
        throw new ApiError(401, "Invalid credentials")
    }
    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200,{
        user: loggedInUser,
        accessToken,
        refreshToken
    }, "User logged in successfully"))
})

const logoutUser = asyncHandler(async (req, res) => {
    const id = req.user._id
    await User.findByIdAndUpdate(id, {
        $set: {
            refreshToken: undefined
        }
    },{
        new: true
    })

    const options = {
        httpOnly: true,
        secure: true
    }
    console.log("User logged out successfully")
    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"))
    
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401, "unauthorized access")
    }
    try {
        const decodedToken = await jwt.verfy(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
        const user = await User.findById(decodedToken._id)
    
        if(!user){
            throw new ApiError(404, "Invalid refresh token")
        }
        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401, "Invalid or expiered refresh token")
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newrefrehToken} = await generateAccessAndRefreshToken(user._id)
    
        return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newrefreshToken, options)
        .json(new ApiResponse(200, {accessToken, newrefrehToken}, "Token refreshed successfully"))
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid token")
        
    }
})

const changeCurrentUserPassword = asyncHandler(async (req, res) => {
    const {oldPassword, newPassword} = req.body;
    const user = await User.findById(req.user?._id) 
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
    if(!isPasswordCorrect){
        throw new ApiError(401, "Invalid password")
    }
    user.password = newPassword
    await user.save({
        validateBeforeSave: false
    })

    res.status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"))
})

const getCurrentUser = asyncHandler(async (req, res) => {
    console.log("getCurrentUser")
    return res.status(200)
    .json(new ApiResponse(200, req.user, "User fetched successfully"))
})

const updateAccountDetails = asyncHandler(async (req, res) => {
    const {email, fullname} = req.body;
    if(!email || !fullname){
        throw new ApiError(400, "Email and Fullname are required")
    }
    const user = await User.findByIdAndUpdate(req.user._id, {
        $set: {
            email: email,
            fullName: fullname
        }
    },{
        new: true
    }
    ).select("-password -refreshToken")

    return res.status(200)
    .json(new ApiResponse(200, user, "User details updated successfully"))
})

const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path
    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar is required")
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if(!avatar.url){
        throw new ApiError(400, "Error while uploading avatar")
    }
    const user = await User.findByIdAndUpdate(req.user?._id, {
        $set: {
            avatar: avatar.url
        }
    },{
        new: true
    }).select("-password -refreshToken")
    return res.status(200)
    .json(new ApiResponse(200, user, "Avatar updated successfully"))
})

const updateUserCover = asyncHandler(async (req, res) => {
    const coverLocalPath = req.file?.path
    if(!coverLocalPath){
        throw new ApiError(400, "cover is required")
    }
    const coverImage = await uploadOnCloudinary(coverLocalPath)

    if(!coverImage.url){
        throw new ApiError(400, "Error while uploading cover")
    }
    const user = await User.findByIdAndUpdate(req.user?._id, {
        $set: {
            coverImage: coverImage.url
        }
    },{
        new: true
    }).select("-password -refreshToken")
    return res.status(200)
    .json(new ApiResponse(200, user, "Cover updated successfully"))
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentUserPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCover
}
