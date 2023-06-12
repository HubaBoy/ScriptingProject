const express = require("express");
const app = express();
const cors = require('cors');
const port = 3000;
const multer = require("multer");
const path = require('path');
const upload = multer({ dest: "uploads/" });
const uploadPath = path.join(__dirname, 'uploads');

let data;

app.post("/upload_files", upload.single("UploadAudio"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  // Move the file to the desired location with its original name and extension
  const originalFileName = req.file.originalname;
  const uploadedFilePath = path.join(__dirname, "uploads", originalFileName);

  fs.rename(req.file.path, uploadedFilePath, (err) => {
    if (err) {
      return res.status(500).json({ message: "Error saving the file" });
    }

    res.json({ message: "File uploaded successfully" });
  });
});


try {
  data = require("./data.json");
} catch (error) {
  console.log("Can't reach the data");
}

app.use(cors()); // Enable CORS

app.get('/data', (req, res) => {
  res.json(data);
});

app.get('/', (req, res) => {
  const jsonLines = JSON.stringify(data, null, 2).split('\n');
  res.send(jsonLines.join('<br>'));
});

app.listen(port, () => {
  console.log('Server is running on port ' + port);
});
