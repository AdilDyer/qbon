import dbConnect from "@/lib/db";
import School from "@/lib/models/school";
import Course from "@/lib/models/course";
import Subject from "@/lib/models/subject";
import { NextResponse, NextRequest } from "next/server";
import Material from "@/lib/models/material";
//to create schools
// export async function GET(req: NextRequest) {
//   try {
//     await dbConnect();

//     const newSchools = [
//       { name: "School of Cybersecurity and Digital Forensics" },
//       { name: "School of Doctoral Studies & Research" },
//       { name: "School of Behavioural Forensics" },
//       { name: "School of Forensic Science" },
//       { name: "School of Law, Forensic Justice and Policy Studies" },
//       { name: "School of Pharmacy" },
//       { name: "School of Management Studies" },
//       { name: "School of Police Science and Security Studies" },
//       { name: "School of Engineering & Technology" },
//       { name: "School of Medico-Legal Studies" },
//       { name: "School of Open Learning" },
//     ];

//     await School.insertMany(newSchools);

//     return NextResponse.json({
//       message: "School created successfully",
//       status: 200,
//     });
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message, status: 400 });
//   }
// }

//to create courses
// export async function GET(req: NextRequest) {
//   try {
//     await dbConnect(); // Ensure dbConnect function connects to your MongoDB

//     // Find the school by name
//     let scsdfSchool = await School.findOne({
//       name: "School of Doctoral Studies & Research",
//     });

//     // Check if the school exists
//     if (!scsdfSchool) {
//       throw new Error("School not found");
//     }

//     // Insert multiple courses associated with the found school
//     await Course.insertMany([
//       {
//         name: "Doctor of Philosophy",
//         school: scsdfSchool._id,
//       },
//       {
//         name: "Doctor of Philosophy (Professional Category)",
//         school: scsdfSchool._id,
//       },
//     ]);

//     return NextResponse.json({
//       message: "Courses created successfully",
//       status: 200,
//     });
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message, status: 400 });
//   }
// }

//to create subjects
// export async function GET(req: NextRequest) {
//   try {
//     await dbConnect(); // Ensure dbConnect function connects to your MongoDB

//     // Find the school by name
//     let scsdfSchool = await Course.findOne({
//       name: "B.Tech - M.Tech. Computer Science and Engineering (Cyber Security)",
//     });

//     // Check if the school exists
//     if (!scsdfSchool) {
//       throw new Error("Course not found");
//     }

//     // Insert multiple courses associated with the found school
//     await Subject.insertMany([
//       {
//         name: "Cyber Law, Policies and Compliance",
//         semesterNo: 7,
//         course: scsdfSchool._id,
//       },
//       {
//         name: "Artificial Intelligence",
//         semesterNo: 7,
//         course: scsdfSchool._id,
//       },
//     ]);

//     return NextResponse.json({
//       message: "Subjects created successfully",
//       status: 200,
//     });
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message, status: 400 });
//   }
// }

//to delete all materials
// export async function GET(req: NextRequest) {
//   try {
//     await dbConnect();

//     await Material.deleteMany({});

//     return NextResponse.json({
//       message: "all materials deleted successfully",
//       status: 200,
//     });
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message, status: 400 });
//   }
// }
