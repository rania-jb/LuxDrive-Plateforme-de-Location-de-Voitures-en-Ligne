const express = require("express");
const route = express.Router();
const User = require("../Models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const { auth } = require('../Middleware/auth');


// ── REGISTER ──
route.post("/register", async (req, res) => {
  try {
    const { firstname, lastname, email, phone, password } = req.body;
    const findUser = await User.findOne({ email }); 
    if (findUser) return res.status(409).json({ message: "user already exists" });
    bcrypt.genSalt(12, function (err, salt) { 
      bcrypt.hash(password, salt, async function (err, hash) { 
        if (err) throw err;
        await User.create({ email, firstname, lastname, phone, password: hash });
        res.status(201).json({ message: "user registered ok" });
      });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ── LOGIN ──
route.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const findUser = await User.findOne({ email });
    if (!findUser) return res.status(404).json({ message: "User email not found" });
    bcrypt.compare(password, findUser.password, function (err, result) {
      if (err) throw err;
      if (result) {
        jwt.sign(
          { id: findUser._id, email: findUser.email, role: findUser.role },
          process.env.JWT_SECRET,
          { expiresIn: "7d" },
          function (err, token) {
            if (err) throw err;
            res.status(200).json({
              token,
              user: {
                _id:       findUser._id,
                firstname: findUser.firstname,
                lastname:  findUser.lastname,
                email:     findUser.email,
                phone:     findUser.phone,
                avatar:    findUser.avatar,
                role:      findUser.role,
              },
            });
          }
        );
      } else {
        res.status(401).json({ message: "Incorrect password" });
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ── GET PROFILE ──
route.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── UPDATE PROFILE ──
route.put('/profile', auth, async (req, res) => {
  try {
    const { firstname, lastname, phone, password } = req.body;
    const user = await User.findById(req.user.id);
    if (firstname) user.firstname = firstname; // Update only if provided
    if (lastname)  user.lastname  = lastname;
    if (phone)     user.phone     = phone;
    if (password) {
      const salt = await bcrypt.genSalt(12);
      user.password = await bcrypt.hash(password, salt);
    }
    const updated = await user.save();

    // Return updated user data without password
    res.json({
      _id:       updated._id,
      firstname: updated.firstname,
      lastname:  updated.lastname,
      email:     updated.email,
      phone:     updated.phone,
      avatar:    updated.avatar,
      role:      updated.role,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── UPLOAD AVATAR ──

// ── CLOUDINARY CONFIG ──
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key:    process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// ── MULTER + CLOUDINARY STORAGE ──
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder:         'car-rental/avatars',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp','avif'],
    transformation: [{ width: 1280, height: 720, crop: 'fill', quality: 'auto' }],
    public_id:      `avatar-${Date.now()}`,
  }),
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

route.put('/profile/avatar', auth, upload.single("avatar"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const user = await User.findById(req.user.id);

    // Supprimer l'ancien avatar Cloudinary si existe
    if (user.avatar && user.avatar.includes('cloudinary')) {
      const publicId = user.avatar.split('/').slice(-2).join('/').split('.')[0]; // Extraire public_id de l'URL
      await cloudinary.uploader.destroy(publicId);
    }

    user.avatar = req.file.path; // URL Cloudinary complète
    await user.save();

    res.json({ avatar: user.avatar });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = route;