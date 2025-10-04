// app/api/upload-photo/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "@/app/libs/connectDB";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET;

export async function POST(req: NextRequest) {
  try {
    // ---------------------------
    // 1️⃣ Check session / auth
    // ---------------------------
    const token = await getToken({ req, secret });
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized. Please login." },
        { status: 401 }
      );
    }

    // ---------------------------
    // 2️⃣ Parse request body
    // ---------------------------
    const body = await req.json();
    const { imageUrl } = body;

    if (!imageUrl) {
      return NextResponse.json(
        { error: "No image URL provided" },
        { status: 400 }
      );
    }

    // ---------------------------
    // 3️⃣ Connect to MongoDB collection
    // ---------------------------
    const collection = await getCollection("photos");

    if (!collection) {
      return NextResponse.json(
        { error: "Failed to connect to collection" },
        { status: 500 }
      );
    }

    // ---------------------------
    // 4️⃣ Insert document
    // ---------------------------
    const result = await collection.insertOne({
      imageUrl: imageUrl,
      userName : token.name,
      userEmail: token.email,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (err) {
    console.error("Upload photo error:", err);
    return NextResponse.json(
      { error: "Failed to save image URL" },
      { status: 500 }
    );
  }
}
