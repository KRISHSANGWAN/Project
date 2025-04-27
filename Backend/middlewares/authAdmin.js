import jwt from 'jsonwebtoken'

// Admin Authetication middleware

const authAdmin = async (req,res,next) => {
    try {

        console.log("In authAdmin")

        const aToken = req.headers['atoken'];

        if(!aToken){
            return res.json({success:false,message:"Not authorised Login Again! 1"})
        }

        const token_decode = jwt.verify(aToken,process.env.JWT_SECRET);

        if(token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD){
            return res.json({success:false,message:"Not authorised Login Again! 2"});
        }

        next();
        
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message}) 
    }
}

export default authAdmin;