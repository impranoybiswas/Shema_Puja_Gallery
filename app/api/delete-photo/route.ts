
import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "@/app/libs/connectDB";
import { getToken } from "next-auth/jwt";
import { ObjectId } from "mongodb";

const secret = process.env.NEXTAUTH_SECRET;

export async function DELETE(req: NextRequest) {
    const token = await getToken({ req, secret });
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized. Please login." },
        { status: 401 }
      );
    }
    const body = await req.json();
    const { id } = body;
    const collection = await getCollection("photos");
    if (!collection) {
      return NextResponse.json({ error: "Failed to connect to collection" });
    }
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 1) {
      return NextResponse.json({ message: "Photo deleted successfully" });
    } else {
      return NextResponse.json({ error: "Photo not found" }, { status: 404 });
    }
  }