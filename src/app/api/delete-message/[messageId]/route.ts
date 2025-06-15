import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import connectDB from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function DELETE(
  req: NextRequest,
  { params }: any
): Promise<Response> {
  const { messageId } = params;

  await connectDB();
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) {
    return new Response(JSON.stringify({
      success: false,
      message: "Not authenticated"
    }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: user._id },
      { $pull: { messages: { _id: messageId } } }
    );

    if (!updatedUser) {
      return new Response(JSON.stringify({
        success: false,
        message: "Message not found or already deleted"
      }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      message: "Message deleted successfully"
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      message: "Internal Server Error"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
