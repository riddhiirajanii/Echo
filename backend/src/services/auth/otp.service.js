const otpGenerator = require("otp-generator");

const otpStore = new Map();

const generateOTP = (email) => {

    const otp = otpGenerator.generate(6,{
        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        specialChars:false
    });

    otpStore.set(email,{
        otp,
        expires: Date.now()+5*60*1000
    });

    return otp;
};

const verifyOTP = (email,userOTP)=>{

    const data = otpStore.get(email);

    if(!data)
        return false;

    if(Date.now()>data.expires){

        otpStore.delete(email);

        return false;
    }

    if(data.otp!==userOTP)
        return false;

    otpStore.delete(email);

    return true;

};

module.exports={
    generateOTP,
    verifyOTP
};