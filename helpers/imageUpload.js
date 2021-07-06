const multer = require("multer");
const path = require("path");

//fix
//i change req.user.id to 1

// Set The Storage Engine
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./public/uploads/" + 1 + "/");
  },
  filename: (req, file, callback) => {
    callback(null, 1 + "-" + Date.now() + path.extname(file.originalname));
  },
});

const menuStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./public/uploads/menu/" + req.user.id + "/");
  },
  filename: (req, file, callback) => {
    callback(null, req.user.id + "-" + Date.now() + path.extname(file.originalname));
  },
});

const userStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./public/uploads/userProfileImg/" + req.user.id + "/");
  },
  filename: (req, file, callback) => {
    callback(null, req.user.id + "-" + Date.now() + path.extname(file.originalname));
  },
});

const bannerStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./public/uploads/bannerimg/" + req.user.id + "/");
  },
  filename: (req, file, callback) => {
    callback(null, req.user.id + "-" + Date.now() + path.extname(file.originalname));
  },
});


// Initialise Upload
const menuUpload = multer({
  storage: menuStorage,
  limits: {
    fileSize: 1000000,
  },
  fileFilter: (req, file, callback) => {
    checkFileType(file, callback);
  },
}).single("menuImageUpload"); // Must be the name as the HTML file upload input

// Initialise Upload
const userUpload = multer({
  storage: userStorage,
  limits: {
    fileSize: 1000000,
  },
  fileFilter: (req, file, callback) => {
    checkFileType(file, callback);
  },
}).single("userfile"); // Must be the name as the HTML file upload input

const bannerUpload = multer({
  storage: bannerStorage,
  limits: {
    fileSize: 1000000,
  },
  fileFilter: (req, file, callback) => {
    checkFileType(file, callback);
  },
}).single("bannerfile"); // Must be the name as the HTML file upload input

// Initialise Upload
const menuUploadEdit = multer({
  storage: menuStorage,
  limits: {
    fileSize: 1000000,
  },
  fileFilter: (req, file, callback) => {
    checkFileType(file, callback);
  },
}).single("menuImageUploadE");

const restUpload = multer({
  storage: storage,
  limits: {
    fileSize: 1000000,
  },
  fileFilter: (req, file, callback) => {
    checkFileType(file, callback);
  },
}).single("restaurantIcon");

// Check File Type
function checkFileType(file, callback) {
  // Allowed file extensions
  const filetypes = /jpeg|jpg|png|gif/;
  // Test extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Test mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return callback(null, true);
  } else {
    callback({ message: "Images Only" });
  }
}

module.exports = { menuUpload, menuUploadEdit, restUpload, userUpload, bannerUpload };
