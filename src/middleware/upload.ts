import multer from 'multer';
import path from 'path';
import { AppError } from '../utils/AppError';
import { config } from '../config/config';

// Configure storage
const storage = multer.memoryStorage();

// File filter function
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Check file type
  const allowedTypes = config.allowedFileTypes;
  const fileExtension = path.extname(file.originalname).toLowerCase().substring(1);
  
  if (allowedTypes.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new AppError(`File type .${fileExtension} is not allowed`, 400));
  }
};

// Configure multer
export const upload = multer({
  storage,
  limits: {
    fileSize: config.maxFileSize, // 10MB default
  },
  fileFilter,
});

// Error handling middleware for multer
export const handleMulterError = (error: any, req: any, res: any, next: any) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large'
      });
    }
    
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files'
      });
    }
    
    return res.status(400).json({
      success: false,
      message: 'File upload error'
    });
  }
  
  next(error);
};