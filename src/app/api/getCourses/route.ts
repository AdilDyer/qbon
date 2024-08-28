import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import School from "@/lib/models/school";
import Course from "@/lib/models/course";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const schoolName = searchParams.get("school");

    if (!schoolName) {
      return NextResponse.json({
        error: "School name is required",
        status: 400,
      });
    }

    const schoolObj = await School.findOne({ name: schoolName });

    if (!schoolObj) {
      return NextResponse.json({ error: "School not found", status: 404 });
    }

    const courses = await Course.find({ school: schoolObj._id });

    return NextResponse.json({ courses, status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, status: 400 });
  }
}
