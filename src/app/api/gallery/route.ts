import { readdirSync } from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export async function GET(request: NextRequest) {
  try {
    const galleryPath = path.join(process.cwd(), "public/gallery");
    const imageFilenames = readdirSync(galleryPath);

    return NextResponse.json({ images: imageFilenames });
  } catch (error) {
    console.error("Unable to retrieve gallery", { error });
  }
}
