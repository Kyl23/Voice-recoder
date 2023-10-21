const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Configure Multer for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Define the directory where you want to save the uploaded files
    const uploadDir = path.join(__dirname, 'uploads');
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Define the filename for the uploaded file
    const filename = Date.now() + path.extname(file.originalname);
    cb(null, filename);
  },
});

const upload = multer({ storage });

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Route to handle file uploads
app.post('/upload', upload.single('file'), (req, res) => {
  // Access the uploaded file via req.file
  const uploadedFile = req.file;

  if (!uploadedFile) {
    return res.status(400).send('No file uploaded.');
  }

  // You can access the file details such as filename, size, etc.
  const { originalname, filename, size } = uploadedFile;
  console.log(`Received file: ${originalname}, saved as: ${filename}, size: ${size} bytes`);

  // Respond with a success message
  res.send('File uploaded successfully.');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});