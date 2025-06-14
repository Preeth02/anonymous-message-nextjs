import connectDB from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { authOptions } from "../../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";

export async function DELETE(
  req: Request, // You can use Request instead of NextRequest here
  context: { params: { messageId: string } }
): Promise<Response> {
  const { messageId } = context.params;
  await connectDB();

  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user || !session) {
    return new Response(
      JSON.stringify({ success: false, message: "Not authenticated" }),
      { status: 400 }
    );
  }

  try {
    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: user._id },
      { $pull: { messages: { _id: messageId } } }
    );

    if (!updatedUser) {
      return new Response(
        JSON.stringify({ success: false, message: "Message not found or already deleted" }),
        { status: 400 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Message has been deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong while deleting the message";
    return new Response(
      JSON.stringify({ success: false, message }),
      { status: 500 }
    );
  }
}
