import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Material from "@/lib/models/material";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { isAdmin, school, course, semester, subject, materialType } =
      await req.json();

    let requiredMaterials;
    if (isAdmin) {
      requiredMaterials = await Material.find({ verified: false });
    } else {
      requiredMaterials = await Material.find({
        verified: true,
        type: materialType,
        subject: subject,
      });
    }

    return NextResponse.json({ requiredMaterials, status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message, status: 400 });
  }
}
