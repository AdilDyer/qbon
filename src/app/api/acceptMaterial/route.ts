import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Material from "@/lib/models/material";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { id } = await req.json();

    await Material.findOneAndUpdate(
      { _id: id },
      { $set: { verified: true } },
      { new: true }
    );

    return NextResponse.json({ status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message, status: 400 });
  }
}
