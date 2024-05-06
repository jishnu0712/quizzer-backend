const multer = require('multer');

// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + "-" + uniqueSuffix + '.xlsx'); 
    }
});

const upload = multer({ storage });

module.exports = upload;
