import multer from "multer"
import { storage } from "../config/cloudconfig.js";

const upload = multer({
  storage:storage,
  limits: {
    fileSize: 1 * 1000 * 1000,
  },
});

export { upload };

