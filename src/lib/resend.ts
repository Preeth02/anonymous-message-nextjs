import { Resend } from "resend";
import verificationEmail from "../../emails/verificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

const resend = new Resend(process.env.RESEND_EMAIL_API);

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: process.env.DOMAIN_EMAIL!,
      to: email,
      subject: "Anonymous Message | Verification Code",
      react: verificationEmail({ username, otp: verifyCode }),
      tags: [{ name: "type", value: "transactional" }],
    });
    return {
      success: true,
      message: "We have sent you a verification code check your email.",
    };
  } catch (error) {
    console.log("Error while sending verification email", error);
    return {
      success: false,
      message: "Failed to send verification email",
    };
  }
}
