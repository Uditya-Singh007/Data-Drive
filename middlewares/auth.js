const jwt = require('jsonwebtoken')

function auth(req,res,next){
    const token =req.cookies.token

    if(!token){
        return res.status(401).json({
            message:'Unauthorized'
        })
    }

    try {
        const decoded = jwt.verify(token ,process.env.JWT_SECRET)
        req.user=decoded
        return next()
        
    } 
    catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                message: 'Unauthorized: Token has expired'
            });
        }


        return res.status(401).json({
            message: 'Unauthorized: Invalid token'
        });
        
    }

}

module.exports=auth;