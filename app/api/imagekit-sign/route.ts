import ImageKit from "imagekit";
import { NextRequest, NextResponse } from "next/server";

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.NEXT_PUBLIC_IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const folder = body.folder || "/default";

    const signature = imagekit.getAuthenticationParameters();
    return NextResponse.json({ ...signature, folder });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to generate signature" }, { status: 500 });
  }
}
