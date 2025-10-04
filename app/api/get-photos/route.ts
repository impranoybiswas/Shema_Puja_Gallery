import { NextResponse } from "next/server";
import { getCollection } from "@/app/libs/connectDB";

export async function GET() {
  const collection = await getCollection("photos");
  if (!collection) {
    return NextResponse.json({ error: "Failed to connect to collection" });
  }
  const photos = await collection.find({}).toArray();
  return NextResponse.json(photos);
}
