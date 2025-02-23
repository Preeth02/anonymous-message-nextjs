import connectDB from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";

export async function POST(request: Request) {
  await connectDB();
  try {
    const { username, content } = await request.json();
    const user = await UserModel.findOne({ username });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    } else if (!user.isAcceptingMessage) {
      return Response.json(
        {
          success: false,
          message: "User is not accepting the message right now",
        },
        {
          status: 400,
        }
      );
    }
    const newMessage = { content, createdAt: new Date() };
    user.messages.push(newMessage as Message);
    await user.save();
    return Response.json(
      {
        success: true,
        message: "Message has been sent to the user",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Something went wrong while sending the message to the user",
      },
      {
        status: 400,
      }
    );
  }
}
