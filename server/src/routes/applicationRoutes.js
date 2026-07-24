import express from "express";
import { z } from "zod";

import {
  createApplication,
  deleteApplication,
  getApplicationById,
  getApplications,
  getApplicationStatistics,
  updateApplication,
} from "../controllers/applicationController.js";
import protect from "../middleware/authMiddleware.js";
import validateRequest from "../middleware/validateRequest.js";

const router = express.Router();

const applicationStatusValues = [
  "SAVED",
  "APPLIED",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
  "WITHDRAWN",
];

const workTypeValues = ["REMOTE", "HYBRID", "ONSITE"];

const employmentTypeValues = [
  "FULL_TIME",
  "PART_TIME",
  "CONTRACT",
  "INTERNSHIP",
  "TEMPORARY",
];

const sortFieldValues = [
  "createdAt",
  "updatedAt",
  "company",
  "jobTitle",
  "dateApplied",
  "deadline",
  "status",
];

const optionalNullableString = (maximumLength) =>
  z
    .union([
      z.string().trim().max(maximumLength),
      z.null(),
    ])
    .optional();

const optionalNullableUrl = z
  .union([
    z
      .string()
      .trim()
      .url("Enter a valid URL."),
    z.literal(""),
    z.null(),
  ])
  .optional();

const optionalNullableEmail = z
  .union([
    z
      .string()
      .trim()
      .email("Enter a valid contact email address."),
    z.literal(""),
    z.null(),
  ])
  .optional();

const optionalNullableDate = z
  .union([
    z
      .string()
      .trim()
      .refine(
        (value) => !Number.isNaN(Date.parse(value)),
        "Enter a valid date."
      ),
    z.literal(""),
    z.null(),
  ])
  .optional();

const applicationFieldsSchema = z.object({
  company: z
    .string()
    .trim()
    .min(2, "Company name must contain at least 2 characters.")
    .max(120, "Company name cannot exceed 120 characters."),

  jobTitle: z
    .string()
    .trim()
    .min(2, "Job title must contain at least 2 characters.")
    .max(120, "Job title cannot exceed 120 characters."),

  location: optionalNullableString(120),

  jobUrl: optionalNullableUrl,

  salaryMin: z
    .number()
    .int("Minimum salary must be a whole number.")
    .nonnegative("Minimum salary cannot be negative.")
    .nullable()
    .optional(),

  salaryMax: z
    .number()
    .int("Maximum salary must be a whole number.")
    .nonnegative("Maximum salary cannot be negative.")
    .nullable()
    .optional(),

  salaryCurrency: z
    .string()
    .trim()
    .length(3, "Currency must use a 3-letter code.")
    .default("USD"),

  status: z
    .enum(applicationStatusValues)
    .default("SAVED"),

  workType: z
    .enum(workTypeValues)
    .nullable()
    .optional(),

  employmentType: z
    .enum(employmentTypeValues)
    .nullable()
    .optional(),

  dateApplied: optionalNullableDate,

  deadline: optionalNullableDate,

  notes: optionalNullableString(5000),

  contactName: optionalNullableString(120),

  contactEmail: optionalNullableEmail,
});

const validateSalaryRange = (data, context) => {
  if (
    data.salaryMin !== null &&
    data.salaryMin !== undefined &&
    data.salaryMax !== null &&
    data.salaryMax !== undefined &&
    data.salaryMax < data.salaryMin
  ) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["salaryMax"],
      message:
        "Maximum salary cannot be lower than minimum salary.",
    });
  }
};

const createApplicationBodySchema =
  applicationFieldsSchema.superRefine(
    (data, context) => {
      validateSalaryRange(data, context);

      if (
        data.status === "APPLIED" &&
        !data.dateApplied
      ) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["dateApplied"],
          message:
            "Add the application date when status is APPLIED.",
        });
      }
    }
  );

const updateApplicationBodySchema =
  applicationFieldsSchema
    .partial()
    .superRefine(validateSalaryRange);

const createApplicationSchema = z.object({
  body: createApplicationBodySchema,
  params: z.object({}),
  query: z.object({}),
});

const getApplicationsSchema = z.object({
  body: z.object({}),

  params: z.object({}),

  query: z.object({
    search: z
      .string()
      .trim()
      .max(120, "Search query is too long.")
      .optional(),

    status: z
      .enum(applicationStatusValues)
      .optional(),

    workType: z
      .enum(workTypeValues)
      .optional(),

    employmentType: z
      .enum(employmentTypeValues)
      .optional(),

    sortBy: z
      .enum(sortFieldValues)
      .default("createdAt"),

    sortOrder: z
      .enum(["asc", "desc"])
      .default("desc"),

    page: z.coerce
      .number()
      .int()
      .positive()
      .default(1),

    limit: z.coerce
      .number()
      .int()
      .min(1)
      .max(100)
      .default(10),
  }),
});

const applicationIdParamsSchema = z.object({
  applicationId: z
    .string()
    .uuid("Application ID must be a valid UUID."),
});

const getApplicationByIdSchema = z.object({
  body: z.object({}),
  params: applicationIdParamsSchema,
  query: z.object({}),
});

const updateApplicationSchema = z.object({
  body: updateApplicationBodySchema.refine(
    (body) => Object.keys(body).length > 0,
    {
      message: "Provide at least one field to update.",
    }
  ),

  params: applicationIdParamsSchema,

  query: z.object({}),
});

const deleteApplicationSchema = z.object({
  body: z.object({}),
  params: applicationIdParamsSchema,
  query: z.object({}),
});

router.use(protect);

router.get(
  "/statistics",
  getApplicationStatistics
);

router
  .route("/")
  .get(
    validateRequest(getApplicationsSchema),
    getApplications
  )
  .post(
    validateRequest(createApplicationSchema),
    createApplication
  );

router
  .route("/:applicationId")
  .get(
    validateRequest(getApplicationByIdSchema),
    getApplicationById
  )
  .patch(
    validateRequest(updateApplicationSchema),
    updateApplication
  )
  .delete(
    validateRequest(deleteApplicationSchema),
    deleteApplication
  );

export default router;