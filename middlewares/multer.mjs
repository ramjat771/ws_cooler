import multer from "multer";
import path from "path";
import fs from "fs";

// --------------------------------------------------
// ENSURE UPLOADS DIRECTORY EXISTS
// --------------------------------------------------
const uploadDir = "web";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// --------------------------------------------------
// MULTER DISK STORAGE
// --------------------------------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path
      .basename(file.originalname, ext)
      .replace(/\s+/g, "_");

    cb(null, `${name}_${Date.now()}${ext}`);
  },
});

// --------------------------------------------------
// MULTER INSTANCE
// --------------------------------------------------
export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// --------------------------------------------------
// FILES → BODY MIDDLEWARE (UNCHANGED LOGIC)
// --------------------------------------------------
export const filesToBody = (req, res, next) => {
  if (req.files && req.files.length) {
    req.files.forEach((file) => {
      const fieldName = file.fieldname;

      // Local file path (later upload to cloudinary)
      const fileUrl = file.path;

      if (req.body[fieldName]) {
        if (Array.isArray(req.body[fieldName])) {
          req.body[fieldName].push(fileUrl);
        } else {
          req.body[fieldName] = [req.body[fieldName], fileUrl];
        }
      } else {
        req.body[fieldName] = fileUrl;
      }
    });
  }
  next();
};
