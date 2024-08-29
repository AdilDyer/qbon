"use client";
import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { useSession } from "next-auth/react";

const AdminPage = () => {
  const [allMaterials, setAllMaterials] = useState([]);
  const { data: session, status } = useSession();
  async function fetchAllMaterials() {
    try {
      const res = await fetch("/api/getAllMaterials", {
        method: "POST",
        body: JSON.stringify({ isAdmin: session?.user?.isAdmin }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const data = await res.json();
        setAllMaterials(data.requiredMaterials);
      } else {
        console.log("Failed to fetch materials");
      }
    } catch (error) {
      console.error("Error fetching materials:", error);
    }
  }
  useEffect(() => {
    fetchAllMaterials();
  }, [session, status]);

  const handleShowFile = (link: string | URL) => {
    window.open(link, "_blank");
  };
  const handleAcceptClick = async (id: any) => {
    try {
      const res = await fetch("/api/acceptMaterial", {
        method: "POST",
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        alert("Material Accepted !");
        fetchAllMaterials();
        return;
      } else {
        alert("Failed to Accept material.");
        return;
      }
    } catch (error) {
      console.error("Error Accepting materials:", error);
    }
  };
  const handleRejectClick = async (id: any) => {
    try {
      const res = await fetch("/api/rejectMaterial", {
        method: "POST",
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        alert("Material Deleted !");
        fetchAllMaterials();
        return;
      } else {
        alert("Failed to Delete material.");
        return;
      }
    } catch (error) {
      console.error("Error Deleting materials:", error);
    }
  };

  return (
    <div className="adminDiv">
      <h1>Welcome Dear Admin ! </h1>
      <h3>Nail It Over!</h3>
      <div className="cardsDiv">
        {/* <div className="card">
          <div className="imgDiv">
            <img src="https://picsum.photos/600/300" alt="" />
          </div>
          <div className="textDiv">
            <Table striped="columns" variant="dark">
              <thead>
                <tr>
                  <th>Name</th>
                  <td>Otto alskdf alkdfj</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>Description</th>
                  <td>
                    Otto Lorem ipsum dolor sit amet consectetur adipisicing
                    elit. Cum nihil ullam assumenda veritatis nisi, laudantium
                    voluptates iste quibusdam voluptas! Aliquam commodi quaerat
                    aspernatur nostrum suscipit aliquid deserunt vero eius est!
                  </td>
                </tr>
                <tr>
                  <th>Material Type</th>

                  <td>Thornton</td>
                </tr>
                <tr>
                  <th>Subject</th>

                  <td>@twitter</td>
                </tr>
                <tr>
                  <th>Uploaded By</th>
                  <td>@twitter</td>
                </tr>
              </tbody>
            </Table>
          </div>
          <div className="buttonsDiv">
            <Button variant="primary" className="btn btn-lg">
              Show File
            </Button>
            <Button className="btn btn-lg" variant="success">
              Accept
            </Button>
            <Button className="btn btn-lg" variant="danger">
              Reject
            </Button>
          </div>
        </div> */}
        {allMaterials.length > 0 ? (
          allMaterials.map((material: any) => (
            <div className="card" key={material._id}>
              <div className="imgDiv">
                <img
                  src={material.link || "https://picsum.photos/600/300"}
                  alt="Material"
                />
              </div>
              <div className="textDiv">
                <Table striped="columns" variant="dark">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <td>{material.name}</td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th>Description</th>
                      <td>{material.description}</td>
                    </tr>
                    <tr>
                      <th>Material Type</th>
                      <td>{material.type}</td>
                    </tr>
                    <tr>
                      <th>Subject</th>
                      <td>{material.subject}</td>
                    </tr>
                    <tr>
                      <th>Uploaded By</th>
                      <td>{material.uploadedBy}</td>
                    </tr>
                  </tbody>
                </Table>
              </div>
              <div className="buttonsDiv">
                <Button
                  onClick={() => handleShowFile(material.link)}
                  variant="primary"
                  className="btn btn-lg"
                >
                  Show File
                </Button>
                <Button
                  onClick={() => handleAcceptClick(material._id)}
                  className="btn btn-lg"
                  variant="success"
                >
                  Accept
                </Button>
                <Button
                  onClick={() => handleRejectClick(material._id)}
                  className="btn btn-lg"
                  variant="danger"
                >
                  Reject
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p>No materials available</p>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
