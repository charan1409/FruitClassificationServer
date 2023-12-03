const express = require("express");
const axios = require("axios");
const app = express();
const formData = require("form-data");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
require("dotenv").config();
const cors = require("cors");

const apiKey = process.env.API_KEY;
const apiSecret = process.env.API_SECRET;

app.use(express.json());

app.use(cors(
    {
        origin: '*'
    }
));
app.get("/", (req, res) => {
  res.send("Hello World!");
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./");
    },
    filename: function (req, file, callback) {
      callback(
        null,
        "image"+path.extname(file.originalname)
      );
    },
  });
  
  const upload = multer({ storage: storage });

app.post("/upload",upload.single("image"), (req, res) => {
  const file = req.file.path;
  const form = new formData();
  form.append("image", fs.createReadStream(file));
    axios({
        method: "post",
        url: "https://api.imagga.com/v2/tags",
        headers: {
        Authorization: "Basic " + Buffer.from(apiKey + ":" + apiSecret).toString("base64"),
        },
        data: form,
    })
        .then((response) => {
        res.send(response.data.result.tags[0].tag.en);
        })
        .catch((err) => {
        console.log(err);
        });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
