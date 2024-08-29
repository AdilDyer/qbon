import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Material from "@/lib/models/material";
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();

    console.log(body);
    let material = new Material({
      name: body.name,
      description: body.description,
      link: body.link,
      type: body.type,
      subject: body.subject,
      uploadedBy: body.uploadedBy,
      verified: false,
    });

    await material.save();
    return NextResponse.json({
      status: 200,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, status: 400 });
  }
}
