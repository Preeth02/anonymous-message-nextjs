import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

// Initialize Google Generative AI SDK
const google = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export const runtime = "edge";

export async function POST(req: Request) {
  //Todo: complete the function
}
