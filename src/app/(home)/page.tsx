"use client";
import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Link from "next/link";

const Home = () => {
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState("");
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedMaterialType, setSelectedMaterialType] = useState("");

  useEffect(() => {
    async function fetchSchools() {
      const res = await fetch("/api/getSchools");
      const data = await res.json();
      setSchools(data.schools);
    }
    fetchSchools();
  }, []);

  useEffect(() => {
    async function fetchCourses() {
      const res = await fetch("/api/getCourses?school=" + selectedSchool);
      const data = await res.json();
      setCourses(data.courses);
      setSelectedSubject("");
      setSubjects([]);
      setSelectedCourse("");
    }
    fetchCourses();
  }, [selectedSchool]);

  useEffect(() => {
    async function fetchSubjects() {
      const res = await fetch(
        "/api/getSubjects?course=" +
          selectedCourse +
          "&semester=" +
          selectedSemester
      );
      const data = await res.json();
      setSubjects(data.subjects);
    }
    fetchSubjects();
  }, [selectedCourse, selectedSemester]);

  return (
    <div className="homeDiv">
      <div className="imgDiv">
        <img
          src="https://res.cloudinary.com/ddxv0iwcs/image/upload/v1707926485/qbon_DEV/Screenshot_2024-02-07_at_10.01.59_AM_mbeifo.png"
          alt="Qbon Loading.."
        />
        <div className="brownStrip"></div>
      </div>
      <div className="textDiv">
        <h4>
          QBON, “The Question Bank of NFSU” is your go-to platform for all
          things academic. 📚✨🧠
        </h4>
        <br />
        <h6>
          When you’re hunting down past question papers for exams, study
          materials, or looking for notes (of any course in our college), QBON
          has your back.
        </h6>
        <h6>
          With a user-friendly interface, 24/7 access, and a vibrant student
          supported assests, it’s more than just a platform—it’s your academic
          adventure waiting to <Link href={"/ourmoto"}>unfold</Link>! 🚀🔥
        </h6>
      </div>
      <div className="selectTagsDiv">
        <Form.Select
          size="lg"
          style={{
            backgroundColor: "#7695FF",
            color: "bisque",
            border: "none",
          }}
          onChange={(e) => setSelectedSchool(e.target.value)}
        >
          <option>Select Your School</option>
          {schools?.map((school: any, index) => (
            <option key={index} value={school.name}>
              {school.name}
            </option>
          ))}
        </Form.Select>
        <Form.Select
          size="lg"
          style={{
            backgroundColor: "#9DBDFF",
            color: "bisque",
            border: "none",
          }}
          onChange={(e) => setSelectedCourse(e.target.value)}
        >
          <option>Select Your Course</option>
          {courses?.map((course: any, index) => (
            <option key={index} value={course.name}>
              {course.name}
            </option>
          ))}
        </Form.Select>
        <Form.Select
          size="lg"
          style={{
            backgroundColor: "#CA8787",
            color: "bisque",
            border: "none",
          }}
          onChange={(e) => setSelectedSemester(e.target.value)}
        >
          <option>Select Your Semester</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
        </Form.Select>
        <Form.Select
          size="lg"
          style={{
            backgroundColor: "#FF9874",
            color: "bisque",
            border: "none",
          }}
          onChange={(e) => setSelectedSubject(e.target.value)}
        >
          <option>Select Your Subject</option>
          {subjects?.map((subject: any, index) => (
            <option key={index} value={subject.name}>
              {subject.name}
            </option>
          ))}
        </Form.Select>
        <Form.Select
          size="lg"
          style={{
            backgroundColor: "#FF8A8A",
            color: "bisque",
            border: "none",
          }}
          onChange={(e) => setSelectedMaterialType(e.target.value)}
        >
          <option>Select Your Material</option>
          <option value="Question Paper">Question Paper</option>
          <option value="Study Material">Study Material</option>
        </Form.Select>
        <Link
          href={
            "/results?school=" +
            selectedSchool +
            "&course=" +
            selectedCourse +
            "&semester=" +
            selectedSemester +
            "&subject=" +
            selectedSubject +
            "&materialType=" +
            selectedMaterialType
          }
        >
          <Button variant="secondary" className="btn btn-lg">
            Search
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
