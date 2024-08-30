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
//         name: "Engineering Physics",
//         semesterNo: 1,
//         course: scsdfSchool._id,
//       },
//       {
//         name: "Engineering Mathematics - 1",
//         semesterNo: 1,
//         course: scsdfSchool._id,
//       },
//       {
//         name: "Basics of Electrical Engineering",
//         semesterNo: 1,
//         course: scsdfSchool._id,
//       },
//       {
//         name: "Fundamentals in Computer Programming with C",
//         semesterNo: 1,
//         course: scsdfSchool._id,
//       },
//       {
//         name: "Engineering Graphics",
//         semesterNo: 1,
//         course: scsdfSchool._id,
//       },
//       {
//         name: "Communication Skills",
//         semesterNo: 1,
//         course: scsdfSchool._id,
//       },
//       {
//         name: "Engineering Chemistry",
//         semesterNo: 2,
//         course: scsdfSchool._id,
//       },
//       {
//         name: "Engineering Mathematics -2",
//         semesterNo: 2,
//         course: scsdfSchool._id,
//       },
//       {
//         name: "Object Oriented Programming with C++",
//         semesterNo: 2,
//         course: scsdfSchool._id,
//       },
//       {
//         name: "Digital Logic Design",
//         semesterNo: 2,
//         course: scsdfSchool._id,
//       },
//       {
//         name: "Professional Ethics",
//         semesterNo: 2,
//         course: scsdfSchool._id,
//       },
//       {
//         name: "Fundamentals of ForensicScienceand Cyber Law",
//         semesterNo: 2,
//         course: scsdfSchool._id,
//       },
//       {
//         name: "Environmental Sciences",
//         semesterNo: 2,
//         course: scsdfSchool._id,
//       },
//       {
//         name: "Engineering Mathematics - 4",
//         semesterNo: 4,
//         course: scsdfSchool._id,
//       },
//       {
//         name: "Basics of Computer Networks",
//         semesterNo: 4,
//         course: scsdfSchool._id,
//       },
//       {
//         name: "Microprocessor and Microcontroller",
//         semesterNo: 4,
//         course: scsdfSchool._id,
//       },
//       {
//         name: "Operating System",
//         semesterNo: 4,
//         course: scsdfSchool._id,
//       },
//       {
//         name: "Cryptography",
//         semesterNo: 4,
//         course: scsdfSchool._id,
//       },
//       {
//         name: "Dot Net Programming",
//         semesterNo: 4,
//         course: scsdfSchool._id,
//       },
//       {
//         name: "Advance Computer Networks",
//         semesterNo: 5,
//         course: scsdfSchool._id,
//       },
//       {
//         name: "Web Development Technology",
//         semesterNo: 5,
//         course: scsdfSchool._id,
//       },
//       {
//         name: "Computer Programming with Python",
//         semesterNo: 5,
//         course: scsdfSchool._id,
//       },
//       {
//         name: "Theory of Computation",
//         semesterNo: 5,
//         course: scsdfSchool._id,
//       },
//       {
//         name: "Wireless Communication and Mobile Computing",
//         semesterNo: 5,
//         course: scsdfSchool._id,
//       },
//       {
//         name: "Big Data",
//         semesterNo: 5,
//         course: scsdfSchool._id,
//       },
//       {
//         name: "Cloud Computing",
//         semesterNo: 5,
//         course: scsdfSchool._id,
//       },
//       {
//         name: "Modern Software Engineering",
//         semesterNo: 6,
//         course: scsdfSchool._id,
//       },
//       {
//         name: "Essentials of Cyber Security",
//         semesterNo: 6,
//         course: scsdfSchool._id,
//       },
//       {
//         name: "Compiler Design",
//         semesterNo: 6,
//         course: scsdfSchool._id,
//       },
//       {
//         name: "Vocational Skills a n d Personality Development",
//         semesterNo: 6,
//         course: scsdfSchool._id,
//       },
//       {
//         name: "Advance Java Programming",
//         semesterNo: 6,
//         course: scsdfSchool._id,
//       },
//       {
//         name: "Computer Graphics",
//         semesterNo: 6,
//         course: scsdfSchool._id,
//       },
//       {
//         name: "Advance Web Development Technology",
//         semesterNo: 6,
//         course: scsdfSchool._id,
//       },
//       {
//         name: "Advance Web Development Technology",
//         semesterNo: 6,
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
