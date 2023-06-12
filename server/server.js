const express = require("express");
const app = express();
const cors = require('cors');
const port = 3000;
const multer = require("multer");
const path = require('path');
const upload = multer({ dest: "uploads/" });
const uploadPath = path.join(__dirname, 'uploads');
const fs = require("fs");

let data;

app.post("/upload_files", upload.fields([
  { name: 'UploadAudio', maxCount: 1 },
  { name: 'UploadImage', maxCount: 1 }
]), (req, res) => {
  if (!req.files || !req.files['UploadAudio'] || !req.files['UploadImage']) {
    return res.status(400).json({ message: "Please upload both audio and image files" });
  }

  const audioFile = req.files['UploadAudio'][0];
  const imageFile = req.files['UploadImage'][0];

  const audioFileName = audioFile.originalname;
  const uploadedAudioPath = path.join(__dirname, "uploads", audioFileName);
  console.log(uploadedAudioPath);

  const imageFileName = imageFile.originalname;
  const uploadedImagePath = path.join(__dirname, "uploads", imageFileName);
  console.log(uploadedImagePath);

  fs.rename(audioFile.path, uploadedAudioPath, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Error saving the audio file" });
    }

    fs.rename(imageFile.path, uploadedImagePath, (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Error saving the image file" });
      }

      res.json({ message: "Files uploaded successfully" });
    });
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

app.get('/uploads/:filename', (req, res) => {
  const filePath = path.join(uploadPath, req.params.filename);
  fs.readFile(filePath, 'utf-8', (err, fileData) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Error reading the file" });
    }
    res.send(fileData);
  });
});

app.listen(port, () => {
  console.log('Server is running on port ' + port);
});
