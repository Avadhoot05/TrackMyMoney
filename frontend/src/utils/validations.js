import validator from 'validator';


import {isPasswordValidate , allowedImageSizeInMB} from '../constant';


export const passwordValidation = password => {
    if(!isPasswordValidate)
        return 1;
    
    let strongPassword = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})')
    let mediumPassword = new RegExp('((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,}))|((?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}))')
    
    if(strongPassword.test(password))
        return 1;
    else if(mediumPassword.test(password))
        return 0.5;
    else
        return 0;
}

export const emailValidation = email =>{
    return validator.isEmail(email);
}

export const profileImageValidation = img =>{
    
    return (img.size/1000000) < allowedImageSizeInMB;
}
