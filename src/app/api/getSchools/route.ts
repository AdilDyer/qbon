import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import School from "@/lib/models/school";
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    let schools = await School.find({});
    return NextResponse.json({
      schools,
      status: 200,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, status: 400 });
  }
}
