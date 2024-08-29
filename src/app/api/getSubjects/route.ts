import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Course from "@/lib/models/course";
import Subject from "@/lib/models/subject";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const courseName = searchParams.get("course");
    const semesterNo = searchParams.get("semester");
    const courseObj = await Course.findOne({ name: courseName });
    const subjects = await Subject.find({
      course: courseObj._id,
      semesterNo: semesterNo,
    });

    return NextResponse.json({ subjects, status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, status: 400 });
  }
}
