import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "@/app/libs/connectDB";

export async function GET(req : NextRequest) {
  const collection = await getCollection("photos");
  if (!collection) {
    return NextResponse.json({ error: "Failed to connect to collection" });
  }

  // 🔍 Extract search query from URL
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";

  // 🧩 Build filter condition for userName or userEmail
  let filter = {};
  if (search) {
    filter = {
      $or: [
        { userName: { $regex: search, $options: "i" } },  // case-insensitive
        { userEmail: { $regex: search, $options: "i" } },
      ],
    };
  }

  // 📦 Fetch filtered or all photos
  const photos = await collection
    .find(filter)
    .sort({ createdAt: -1 })
    .toArray();

  return NextResponse.json(photos);
}
