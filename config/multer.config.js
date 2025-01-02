const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary.config.js');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary, 
  params: {
    folder: 'drive',    
  },
  unique_filename:true
});

const upload = multer({ storage: storage });

module.exports = upload;
