const express = require('express')
const router = express.Router()
const upload = require('../config/multer.config')
const fileModel = require('../models/files.model')
const authMiddleware = require('../middlewares/auth')
const cloudinary = require('cloudinary').v2
//home get route-------------------------------------------------------------------------------------------------------------------------------------------------------------
router.get('/home',authMiddleware ,async(req,res)=>{

   const userFile =await fileModel.find({
    user:req.user.userId
   })
    res.render('home', {
      files:userFile
    })
})



//upload post route ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
router.post('/upload', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    // Get the Cloudinary file response details
    const cloudinaryResponse = req.file;
    console.log('Cloudinary Response:', cloudinaryResponse)

    // Create a new file document in your database
    const newFile = await fileModel.create({
        path: cloudinaryResponse.secure_url, // Cloudinary URL for the file
        originalname: req.file.originalname,  // Original name of the file
        user: req.user.userId,                // User ID from the authenticated user
        cloudinary_id: req.file.filename, // Cloudinary file public ID
        createdAt: Date.now()                 // Timestamp of file upload
    });
    console.log('newfile',newFile)

    // Send back the response
    // return res.status(200).json({ newFile, message: 'File uploaded successfully!' });
    return res.redirect('/home');
} catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error uploading file', error: error.message });
}


    

    // if (req.file) {
    //   console.log('File uploaded successfully:', req.file);
    //   return res.json({
    //     message: 'File uploaded successfully!',
    //     file: req.file
    //   });
    // } else {
    //   return res.status(400).json({ message: 'No file uploaded!' });
    // }
  });



  //download post route---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  router.post('/download/:path', authMiddleware, async (req, res, next) => {
    const loggedInUser = req.user.userId;  // Assuming your auth middleware attaches user info
    const filePath = req.params.path;
  
    try {
      // Find the file record in the database (use the unique identifier like 'path' or 'public_id' here)
      const file = await fileModel.findOne({
        user: loggedInUser,
        path: filePath
      });
  
      if (!file) {
        return res.status(401).json({
          message: 'File not found or unauthorized access'
        });
      }
  
      // Fetch the file from Cloudinary using the file's public_id or original file URL
      const cloudinaryPublicId = file.cloudinary_id;  // Assuming you stored the cloudinary ID in your model
  
      // Get the download URL from Cloudinary
      cloudinary.api.resource(cloudinaryPublicId, (error, result) => {
        if (error) {
          return res.status(500).json({ message: 'Error fetching file from Cloudinary', error });
        }
  
        // If everything is fine, redirect to the Cloudinary download URL
        res.redirect(result.secure_url);  // Redirect user to the Cloudinary URL
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Internal Server Error',
        error: error.message
      });
    }
  });

module.exports = router 