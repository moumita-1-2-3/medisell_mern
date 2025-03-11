import mongoose from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
    username :{
        type:String,
        required:true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email :{
        type:String,
        required:true,
        unique: true,
        lowercase: true,
        trim: true
    },
    fullname :{
        type:String,
        required:true,
        unique: true,
        index: true
    },
    avatar :{
        type:String,
        require: true 
    },
    coverImage:{
        type:String
    },
    password :{
        type:String,
        require : [true, 'Password is required']
    },
    refrehToken : { 
        type: String
     },

}, {timestamps: true})

userSchema.pre("save",  async function (next) {
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10)
    next()
})
userSchema.methods.isPasswordCorrect  = async function (password) { 
    return await bcrypt.compare (password, this.password)
}
userSchema.methods.generateRefreshToken = function () { 
    return jwt.sign({ _id : this._id,
        },
         process.env.REFRESH_TOKEN_SECRET || 'secret',
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIREY || '10d'
        }
    ) 
}
userSchema.methods.generateAccessToken = function () { 	
    return jwt.sign({ 
        _id: this._id,
        username: this.username,
        email: this.email,
        fullname: this.fullname,
    }, 
    process.env.ACCESS_TOKEN_SECRET || 'secret',
    { 
        expiresIn: process.env.ACCESS_TOKEN_EXPIREY || '1d' 
    })
}
userSchema.plugin(mongooseAggregatePaginate)
export const User = mongoose.model('User', userSchema);