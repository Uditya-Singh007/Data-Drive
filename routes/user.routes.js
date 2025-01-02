const express= require('express');
const router= express.Router();
const { body,validationResult } = require('express-validator');
const userModel = require('../models/user.model')
const bcrypt = require('bcrypt')

const jwt = require('jsonwebtoken')


//register get route---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

router.get('/register',(req,res)=>{
    res.render('register');
})





//register post route---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
router.post('/register',
    body('email').trim().isEmail().isLength({min : 8}),
    body('password').trim().isLength({min: 3}),
    body('username').trim().isLength({min: 3}),
    async (req,res) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array(),
                message: 'Invalid data'
            })
        }
        const { email , username , password }=req.body

        const hashPassword = await bcrypt.hash(password, 10)
        
        const newUser = await userModel.create({
            email,
            username,
            password:hashPassword
        })
        
        
        // res.json({newUser})
        return res.redirect('/user/login');

   
        
     

    }
)





//login get route---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
router.get('/login',(req,res)=>{
    res.render('login')
})




//login post route---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

router.post('/login',
    body('username').trim().isLength({min : 3}),
    body('password').trim().isLength({min : 3})
    , async(req,res)=>{

        const errors = validationResult(res)

        if(!errors.isEmpty()){
            return res.status(400).json({
                errors:errors.array(),
                message:'Invalid  details'
            })
        }

        const{username , password} = req.body

        const user =await userModel.findOne({
            username : username
        })

        if(!user){
            return res.status(400).json({
                errors: errors.array(),
                message:'Invalid username and password'
            })
        }

        const ismatch = await bcrypt.compare(password, user.password)

        if(!ismatch){
            return res.status(400).json({
                errors: errors.array(),
                message:'Invalid username and password'
            })
        }

        const token = jwt.sign({
            username: user.username,
            email: user.email,
            userId: user._id
        }, process.env.JWT_SECRET , { expiresIn: '1h' });

        res.cookie('token', token, {
            httpOnly: true,   // Can't be accessed via JavaScript (XSS protection)
            secure: process.env.NODE_ENV === 'production', // Ensure secure cookie in production (HTTPS)
            sameSite: 'Strict' // Prevent CSRF attacks
        });

        // return res.json({ message: 'Logged in successfully' });
        res.redirect('/home');


})

module.exports = router;