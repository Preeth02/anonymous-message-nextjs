import { google } from "@ai-sdk/google";
import { generateText, streamText } from "ai";

const model = google("gemini-1.5-flash");

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { text } = await generateText({
      model: model,
      prompt:
        "Create a list of three open-ended and engaging questions formatted as a single string and must be unique. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.",
      temperature: 1.5,
      frequencyPenalty: 0.6,
    });
    return Response.json(
      {
        success: true,
        message: "Messages has been fetched from ai.",
        suggestedMessages: text,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return Response.json(
        {
          success: false,
          message: error.message || "Failed to suggest message",
        },
        { status: 400 }
      );
    }
    return Response.json(
      {
        success: false,
        message: "Something went wrong while fetching messages from ai",
      },
      { status: 500 }
    );
  }
}
