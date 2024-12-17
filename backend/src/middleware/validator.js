const { z } = require("zod");
const mongoose = require("mongoose")
const emailValidationSchema = z.object({
  email: z
    .string({
      required_error: "Email is missing!",
      invalid_type_error: "Invalid email type!",
    })
    .email("Invalid email!"),
});

const updateUserSchema = z.object({
  name: z
    .string({
      required_error: "Name is missing!",
      invalid_type_error: "Invalid name!",
    })
    .min(3,"Name must be 3 characters long!")
    .trim(),
})

const newUserSchema = z.object({
  name: z
    .string({
      required_error: "Name is missing!",
      invalid_type_error: "Invalid name!",
    })
    .min(3,"Name must be 3 characters long!")
    .trim(),
    email: z
    .string({
      required_error: "Email is missing!",
      invalid_type_error: "Invalid email type!",
    })
    .email("Invalid email!"),
  password: z
    .string({
      required_error: "Password is missing!",
      invalid_type_error: "Invalid password type!",
    })
    .min(6, "Password must be at least 6 characters long!"),
});

const newReviewSchema = z.object({
  rating: z
    .number({
      required_error: "Rating is missing!",
      invalid_type_error: "Invalid rating!",
    })
    .min(1, "Minimum rating should be 1")
    .max(5, "Maximum rating should be 5"),
    content: z
    .string({
      required_error: "Content is missing!",
      invalid_type_error: "Invalid content!",
    })
    .min(1, "Content cannot be empty!") // Đảm bảo content có ít nhất 1 ký tự
    .trim(),
  bookId: z
    .string({
      required_error: "Book id is missing!",
      invalid_type_error: "Invalid book id!",
    })
    .transform((arg, ctx) => {
      if (!mongoose.isValidObjectId(arg)) {
        ctx.addIssue({ code: "custom", message: "Invalid book id!" });
        return z.NEVER;
      }
      return arg;
    }),
});

const validate = (schema) => {
  return (req, res, next) => {

    const result = schema.safeParse(req.body);

    if (result.success) {
      req.body = result.data;
      next();
    } else {
      const errors = result.error.flatten().fieldErrors;
      return res.status(422).json({ errors });
    }
  };
};

module.exports = { emailValidationSchema, validate, newUserSchema, newReviewSchema,updateUserSchema};