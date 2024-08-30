import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Material from "@/lib/models/material";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { userEmail } = await req.json();

    let requiredMaterials = await Material.find({
      uploadedBy: userEmail,
      verified: true,
    });

    return NextResponse.json({ requiredMaterials, status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message, status: 400 });
  }
}
