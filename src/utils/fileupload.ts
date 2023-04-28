import multer from "multer";

const upload = multer({
    limits: {
        fileSize: 2000000,
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
            return cb(
                new Error("Please upload an image with png, jpg or jpeg format")
            );
        }
        cb(null, true);
    },
});

export default upload;
