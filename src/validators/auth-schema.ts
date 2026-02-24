import z from "zod";
import { DEFAULT_VALUES } from "../utils/constant";

export const createRegisterSchema = (
    isEmailOtpRequired: boolean,
    isPhoneOtpRequired: boolean
) =>
    z
        .object({
            firstName: z.string().min(1, "First Name is required"),

            lastName: z.string().min(1, "Last Name is required"),

            designation: z.string().min(1, "Designation is required"),

            email: z.string().email("Invalid email address"),

            emailOTP: z.string().optional(),

            password: z
                .string()
                .min(DEFAULT_VALUES.PASSWORD_SIZE, `Password must be at least ${DEFAULT_VALUES.PASSWORD_SIZE} characters`)
                .max(20, "Password is too long"),

            confirmPassword: z.string(),

            countryCode: z.string().min(1, "Select country"),

            contactNumber: z
                .string()
                .min(10, "Mobile number must be 10 digits")
                .max(10, "Mobile number must be 10 digits")
                .regex(/^[0-9]+$/, "Only numbers allowed"),

           
            contactNumberOTP: z.string().optional(),

            organisation: z.string().min(1, "Organisation is required"),

            termsAndCondition: z.boolean(),
        })
        .superRefine((data, ctx) => {
            
            if (isEmailOtpRequired) {
                if (
                    !data.emailOTP ||
                    data.emailOTP.length !== DEFAULT_VALUES.OTP_FIELD_SIZE
                ) {
                    ctx.addIssue({
                        path: ["emailOTP"],
                        code: z.ZodIssueCode.custom,
                        message: `Please enter a valid ${DEFAULT_VALUES.OTP_FIELD_SIZE}-digit Email OTP`,
                    });
                }
            }

            if (isPhoneOtpRequired) {
                if (
                    !data.contactNumberOTP ||
                    data.contactNumberOTP.length !== DEFAULT_VALUES.OTP_FIELD_SIZE
                ) {
                    ctx.addIssue({
                        path: ["contactNumberOTP"],
                        code: z.ZodIssueCode.custom,
                        message: `Please enter a valid ${DEFAULT_VALUES.OTP_FIELD_SIZE}-digit Contact OTP`,
                    });
                }
            }

          
            if (data.password !== data.confirmPassword) {
                ctx.addIssue({
                    path: ["confirmPassword"],
                    code: z.ZodIssueCode.custom,
                    message: "Passwords do not match",
                });
            }

            
            if (!data.termsAndCondition) {
                ctx.addIssue({
                    path: ["termsAndCondition"],
                    code: z.ZodIssueCode.custom,
                    message: "You must accept terms and conditions",
                });
            }
        });

export type RegisterFormValues = z.infer<
    ReturnType<typeof createRegisterSchema>
>;


