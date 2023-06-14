const express = require("express");
const app = express();
const cors = require('cors');
const port = 3000;
const multer = require("multer");
const path = require('path');
const upload = multer({
  storage: multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      callback(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    },
  }),
});
const fs = require("fs");

let data;

app.use(cors());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

const uploadPath = "/path/to/upload/directory";

app.post(
  "/upload_files",
  upload.fields([
    { name: "audioFile", maxCount: 1 },
    { name: "imageFile", maxCount: 1 }
  ]),
  (req, res) => {
    if (!req.files || Object.keys(req.files).length < 2) {
      return res.status(400).json({ message: "Please upload both audio and image files" });
    }

    const audioFile = req.files["audioFile"][0];
    const imageFile = req.files["imageFile"] ? req.files["imageFile"][0] : null;

    const audioFileName = audioFile.originalname;
    const uploadedAudioPath = path.join(uploadPath, audioFileName);
    console.log(uploadedAudioPath);

    fs.rename(audioFile.path, uploadedAudioPath, (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Error saving the audio file" });
      }

      if (imageFile) {
        const imageFileName = imageFile.originalname;
        const uploadedImagePath = path.join(uploadPath, imageFileName);
        console.log(uploadedImagePath);

        fs.rename(imageFile.path, uploadedImagePath, (err) => {
          if (err) {
            console.log(err);
            // Rollback: Delete the already uploaded audio file
            fs.unlink(uploadedAudioPath, () => {
              return res.status(500).json({ message: "Error saving the image file" });
            });
          }

          // Both audio and image files uploaded successfully
          res.json({ message: "Audio and image files uploaded successfully" });
        });
      } else {
        // Only audio file uploaded
        res.json({ message: "Audio file uploaded successfully" });
      }
    });
  }
);



try {
  data = require("./data.json");
} catch (error) {
  console.log("Can't reach the data");
}


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

