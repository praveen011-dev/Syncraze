import { body } from "express-validator";

const noteValidator = () => {
  return [
    body("content")
      .trim()
      .notEmpty()
      .withMessage("Content is required")
      .isLength({ min: 4 , max: 50 })
      .withMessage("Title must be at least 4 characters long and cannot exceed 50 characters.")
  ]
};

export { noteValidator };