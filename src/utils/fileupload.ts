import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import config from "config";
import { Request } from 'express';

cloudinary.config({
    cloud_name: config.get("cloudinary.cloud_name"),
    api_key: config.get("cloudinary.api_key"),
    api_secret: config.get("cloudinary.api_secret")
});

const storage = multer.diskStorage({
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    }
});

const fileFilter = (req: Request, file: any, cb: any) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        // accept file
        cb(null, true);
    } else {
        // reject file
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5MB
    }
});

export {
    upload,
    cloudinary
};