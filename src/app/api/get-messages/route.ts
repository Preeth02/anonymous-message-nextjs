import connectDB from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession, User } from "next-auth";
import mongoose from "mongoose";

export async function GET(req: Request) {
  await connectDB();
  const session = await getServerSession(authOptions);
  const user: User = session?.user;
  if (!user || !session) {
    return Response.json(
      { success: false, message: "Not authenticated" },
      { status: 400 }
    );
  }
  const userId = new mongoose.Types.ObjectId(user._id);
  try {
    const user = await UserModel.aggregate([
      {
        $match: {
          _id: userId,
        },
      },
      {
        $unwind: "$messages",
      },
      {
        $sort: { "messages.createdAt": -1 },
      },
      {
        $group: {
          _id: "$_id",
          messages: {
            $push: "$messages",
          },
        },
      },
    ]);
    if (!user || user.length === 0) {
      return Response.json(
        { success: false, message: "No messages found" },
        { status: 400 }
      );
    }
    console.log("User afer aggreagating messages----->", user);
    return Response.json(
      {
        success: true,
        message: "User message fetched successfully",
        messages: user[0].messages,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      return Response.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Something went wrong while fetching messages",
        },
        { status: 500 }
      );
    }
  }
}
