const express = require('express');
const app = express();
const request = require('request');
const wikip = require('wiki-infobox-parser');
const multer = require('multer');
const path = require('path');

// ejs
app.set("view engine", 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Fayllarni saqlash uchun Multer konfiguratsiyasi
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Fayllar "uploads/" papkasida saqlanadi
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Fayl nomini o'zgartirish
    }
});
const upload = multer({ storage: storage });


app.post('/', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('Fayl yuklanmadi!');
    }
    res.send({ message: 'Fayl muvaffaqiyatli yuklandi!', filename: req.file.filename });
});

// Bir nechta fayl yuklash uchun endpoynt (agar kerak bo'lsa)
app.post('/upload-multiple', upload.array('files', 5), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "No files uploaded." });
    }
    const filenames = req.files.map(file => file.filename);
    res.json({ message: "Files uploaded successfully", filenames });
});

// port
app.listen(3000, () => console.log("Listening at port 3000..."));
