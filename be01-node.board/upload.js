const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const moment = require('moment');
const multer  = require('multer');
const { v4: uuidv4 } = require('uuid');
const { mkdir } = require('fs');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '/storage'));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage });
// multer : 파일 업로드 해주는 미들웨어 (미들웨어 - 요청이 중간에 들어간다)

app.listen(3300, () => { console.log('http://127.0.0.1:3300') });

app.use("/", express.static(path.join(__dirname, './public')));
app.use("/uploads", express.static(path.join(__dirname, './storage'))); // 업로드는 해킹의 위험이 있기 때문에 루트와 폴더명을 다르게 함

app.post('/save', upload.single('upfile'), (req, res, next) => { // upfile = upload.html에서 input의 name
	res.send("저장");
});