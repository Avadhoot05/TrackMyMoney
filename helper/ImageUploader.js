import {createRequire} from 'module';
const require = createRequire(import.meta.url);
import dotenv from "dotenv";

dotenv.config({ path: "./config.env" });


const cloudnary = require("cloudinary").v2;

cloudnary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})



export const UploadImage = async (image) =>{
    try {
        const response =  await cloudnary.uploader.upload(image, 
        {
            upload_presets: 'expensetrackerpreset'
        }, );

        console.log(response);
        return response;
    } catch (err) {
        console.log(">>>>>>");
        console.error(err);
        return false;
    }
    
}
