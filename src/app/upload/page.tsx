"use client";
import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Modal from "react-bootstrap/Modal";
import { CldUploadWidget } from "next-cloudinary";

const UploadPage = () => {
  const { data: session } = useSession();
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState("");
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedMaterialType, setSelectedMaterialType] = useState("");
  const [materialName, setMaterialName] = useState("");
  const [materialDescription, setMaterialDescription] = useState("");
  const [materialFileLink, setMaterialFileLink] = useState("");
  const [materialPublicId, setMaterialPublicId] = useState("");
  const [isAgreed, setIsAgreed] = useState(false);
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const [showModalTwo, setShowModalTwo] = useState(false);
  const [showModalThree, setShowModalThree] = useState(false);
  const [showModalFour, setShowModalFour] = useState(false);

  const handleCloseModalTwo = () => setShowModalTwo(false);
  const handleShowModalTwo = () => setShowModalTwo(true);
  const handleCloseModalThree = () => setShowModalThree(false);
  const handleShowModalThree = () => setShowModalThree(true);
  const handleCloseModalFour = () => setShowModalFour(false);
  const handleShowModalFour = () => setShowModalFour(true);

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

  const handleSubmit = async () => {
    if (!isAgreed) {
      handleShowModalTwo();
      return;
    }
    if (
      !selectedCourse ||
      !selectedSchool ||
      !selectedSemester ||
      !selectedSubject ||
      !selectedMaterialType ||
      !materialName ||
      !materialDescription ||
      !materialFileLink ||
      !materialPublicId
    ) {
      handleShowModalThree();
      return;
    }

    let bodyContent = {
      uploadedBy: session?.user?.email,
      subject: selectedSubject,
      type: selectedMaterialType,
      name: materialName,
      description: materialDescription,
      link: materialFileLink,
      cloudinaryPublicId: materialPublicId,
    };

    try {
      const res = await fetch("/api/uploadMaterial", {
        method: "POST",
        body: JSON.stringify(bodyContent),
      });

      if (res.ok) {
        handleShowModalFour();
        setIsImageUploaded(false);
        return;
      } else {
        alert("Failed to upload material");
      }
    } catch (error) {
      alert("Error uploading material:" + error);
    }
  };

  return (
    <>
      {!session ? (
        <>
          <div className="notLoggedInUploadDiv">
            <h1>Kindly Log-In first to start Uploading.</h1>
          </div>
        </>
      ) : (
        <>
          <div className="uploadDiv">
            <div className="upperPart">
              <div className="leftPart">
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
                    {schools.map((school: any, index) => (
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
                </div>
              </div>
              <div className="rightPart">
                <Form.Control
                  style={{
                    backgroundColor: "#AAB396",
                    color: "bisque",
                    border: "none",
                  }}
                  size="lg"
                  type="text"
                  placeholder="Enter Material Name "
                  onChange={(e) => setMaterialName(e.target.value)}
                />
                <Form.Control
                  style={{
                    backgroundColor: "#FFBE98",
                    color: "bisque",
                    border: "none",
                  }}
                  size="lg"
                  type="text"
                  placeholder="Enter Material Description"
                  onChange={(e) => setMaterialDescription(e.target.value)}
                />
                <CldUploadWidget
                  options={{ sources: ["local"], multiple: false }}
                  signatureEndpoint="/api/sign-image"
                  onSuccess={(result: any, { widget }) => {
                    setMaterialFileLink(result?.info?.secure_url);
                    setMaterialPublicId(result?.info?.public_id);
                    setIsImageUploaded(true);
                  }}
                  onError={(error, { widget }) => {
                    alert("Failed to upload : File Size is larger than 10MB !");
                  }}
                  onQueuesEnd={(result, { widget }) => {
                    widget.close();
                  }}
                >
                  {({ open }) => {
                    return (
                      <Button
                        onClick={() => open()}
                        disabled={isImageUploaded}
                        className="btn btn-lg"
                      >
                        {isImageUploaded
                          ? "File Accepted"
                          : "Select File"}
                      </Button>
                    );
                  }}
                </CldUploadWidget>
              </div>
            </div>
            <div className="lowerPart">
              <div className="leftPart">
                <h6>
                  I hereby confirm that the study material I am submitting is
                  intended for the benefit of all students using this platform.
                  I acknowledge that the material will be made publicly
                  available for other students to view and use and I take full
                  responsibility for its content and sharing. I understand that
                  this platform is designed for the mutual benefit of all
                  students, and I agree to share my submission in the spirit of
                  academic collaboration and support.
                </h6>
                <Form.Check
                  type={"checkbox"}
                  label={"I Agree"}
                  checked={isAgreed}
                  onChange={(e) => setIsAgreed(e.target.checked)}
                />
              </div>
              <div className="rightPart">
                {isAgreed ? (
                  <>
                    <Button
                      variant="primary"
                      className="btn btn-lg"
                      onClick={handleSubmit}
                    >
                      Upload Material
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="primary"
                      className="btn btn-lg"
                      onClick={handleShowModalTwo}
                    >
                      Upload Material
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
          <Modal
            show={showModalTwo}
            onHide={handleCloseModalTwo}
            className="uploadNotPossibleModal loginModal"
          >
            <Modal.Header closeButton>
              <Modal.Title>Sorry, could not proceed to upload :</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <h6>Please Agree to the Terms and Conditions.</h6>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={handleCloseModalTwo}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
          <Modal
            show={showModalThree}
            onHide={handleCloseModalThree}
            className="uploadNotPossibleModal loginModal"
          >
            <Modal.Header closeButton>
              <Modal.Title>Sorry, could not proceed to upload :</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <h6>Please Fill in All the fields.</h6>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={handleCloseModalThree}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
          <Modal
            show={showModalFour}
            onHide={handleCloseModalFour}
            className="uploadNotPossibleModal loginModal"
          >
            <Modal.Header closeButton>
              <Modal.Title>Thanks for Supporting !</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <h6>
                Your Material would be live soon after approval from Admin.
                Thanks for your Support &hearts;{" "}
              </h6>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={handleCloseModalFour}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </>
  );
};

export default UploadPage;
