import { z } from "zod";

export const phoneSchema = z
  .string()
  .trim()
  .transform((v) => v.replace(/\D/g, "").replace(/^91(?=\d{10}$)/, ""))
  .pipe(z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"));

export const pincodeSchema = z
  .string()
  .trim()
  .regex(/^[1-9]\d{5}$/, "Enter a valid 6-digit PIN code");

export const addressSchema = z.object({
  fullName: z.string().trim().min(2, "Enter the recipient's full name").max(80),
  phone: phoneSchema,
  line1: z.string().trim().min(5, "Enter house / flat number and street").max(120),
  line2: z.string().trim().max(120).optional().or(z.literal("")),
  landmark: z.string().trim().max(80).optional().or(z.literal("")),
  city: z.string().trim().min(2, "Enter the city").max(60),
  state: z.string().trim().min(2, "Select a state"),
  pincode: pincodeSchema,
  type: z.enum(["HOME", "WORK", "OTHER"]).default("HOME"),
  isDefault: z.boolean().optional(),
});
export type AddressInput = z.infer<typeof addressSchema>;

export const otpSchema = z.string().trim().regex(/^\d{6}$/, "Enter the 6-digit OTP");

export const emailSchema = z.string().trim().toLowerCase().pipe(z.email("Enter a valid email address"));

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(80),
  email: emailSchema,
  phone: z.string().trim().optional().or(z.literal("")),
  subject: z.string().trim().min(3, "Add a subject").max(120),
  message: z.string().trim().min(10, "Tell us a little more (at least 10 characters)").max(2000),
});

export const reviewSchema = z.object({
  productId: z.string().min(1),
  rating: z.coerce.number().int().min(1, "Choose a rating").max(5),
  title: z.string().trim().min(3, "Add a short title").max(80),
  body: z.string().trim().min(10, "Share at least a sentence about the product").max(1500),
  city: z.string().trim().max(40).optional().or(z.literal("")),
});

/** Formats the first issue of a Zod error for toast/field display. */
export function firstIssue(error: z.ZodError) {
  return error.issues[0]?.message ?? "Please check the details and try again";
}

/** Flattens Zod field errors into { field: message }. */
export function fieldErrors(error: z.ZodError) {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".");
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}
