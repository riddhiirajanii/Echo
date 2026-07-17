
const {
    generateOTP,
    verifyOTP
}=require("../../services/auth/otp.service");

const {
    sendOTPEmail
}=require("../../services/auth/email.service");

const sendOTP = async(req,res)=>{

    try{

        const {email}=req.body;

        const otp=generateOTP(email);

        await sendOTPEmail(email,otp);

        res.json({
            success:true,
            message:"OTP sent successfully."
        });

    }
    catch(error){

        console.error(error);

        res.status(500).json({
            success:false,
            message:"Failed to send OTP."
        });

    }

};

const verifyEmailOTP = async(req,res)=>{

    try{

        const {email,otp}=req.body;

        const valid=verifyOTP(email,otp);

        if(!valid){

            return res.status(400).json({

                success:false,

                message:"Invalid or expired OTP."

            });

        }

        res.json({

            success:true,

            message:"Email verified successfully."

        });

    }
    catch(error){

        console.error(error);

        res.status(500).json({

            success:false,

            message:"Verification failed."

        });

    }

};

module.exports={
    sendOTP,
    verifyEmailOTP
};