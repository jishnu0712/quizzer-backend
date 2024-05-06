const fs = require('fs');

// Function to delete the uploaded file
function deleteUploadedFile(filePath) {
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error('Error deleting file:', err);
        } else {
            console.log('File deleted successfully:', filePath);
        }
    });
}

module.exports = deleteUploadedFile;