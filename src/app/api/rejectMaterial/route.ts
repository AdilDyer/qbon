import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Material from "@/lib/models/material";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { id } = await req.json();

    const material = await Material.findById(id);
    const cloudinaryResponse = await cloudinary.uploader.destroy(
      material.cloudinaryPublicId
    );

    if (cloudinaryResponse.result !== "ok") {
      throw new Error("Failed to delete the file from Cloudinary");
    }
    await Material.findOneAndDelete({ _id: id });

    return NextResponse.json({ status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message, status: 400 });
  }
}
