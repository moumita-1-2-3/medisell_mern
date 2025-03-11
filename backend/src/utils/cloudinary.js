import {v2 as  cloudinary} from 'cloudinary'
import fs from 'fs'


cloudinary.config({
    cloud_name: "dsiqrov5i",
    api_key: "736865823972957",
    api_secret: "T2zfINVMwWNHGfsSntfk7ukBBhTY"
});

const uploadOnCloudinary = async (file) => {
    try {
        console.log('Uploading image...')
        if(!file) return null
        const result = await cloudinary.uploader.upload(file, {
           resource_type: 'auto',
        })
        fs.unlinkSync(file)
        console.log(
            `Image uploaded on Cloudinary with URL: ${result.url}`
        )
        return result
    } catch (error) {
        fs.unlinkSync(file)
        console.error('Error uploading image:', error)
        return null
    }
}
export {uploadOnCloudinary}