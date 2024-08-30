"use client";
import { signOut, useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";

const Account = () => {
  const { data: session } = useSession();
  const [userUploads, setUserUploads] = useState([]);
  async function fetchUserUploads() {
    try {
      const res = await fetch("/api/getUserUploads", {
        method: "POST",
        body: JSON.stringify({ userEmail: session?.user?.email }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const data = await res.json();
        console.log(data);
        setUserUploads(data.requiredMaterials);
      } else {
        console.log("Failed to fetch materials");
      }
    } catch (error) {
      console.error("Error fetching materials:", error);
    }
  }
  useEffect(() => {
    fetchUserUploads();
  }, [session]);

  const handleShowFile = (link: string | URL) => {
    window.open(link, "_blank");
  };

  return (
    <>
      <div className="accountDiv">
        {session ? (
          <>
            <div className="personalInfo">
              <div className="imgDiv">
                <img src={session?.user?.image!} alt="" />
              </div>
              <div className="textDiv">
                <h1>{session?.user?.name}</h1>
                <h3>{session?.user?.email}</h3>
                <Button
                  variant="outline-warning"
                  onClick={() => {
                    signOut();
                  }}
                >
                  Logout
                </Button>
              </div>
            </div>
            <div className="yourUploadsDiv">
              <h1>
                Your Uploads{" "}
                <span role="img" aria-label="emoji">
                  📂
                </span>
              </h1>
              {userUploads.length === 0 ? (
                <div className="noUploadsDiv">
                  <h3>
                    Oops! No uploads yet{" "}
                    <span role="img" aria-label="surprised emoji">
                      😲
                    </span>
                  </h3>
                  <br />
                  <p>
                    Don't worry, it's super easy to get started. Upload your
                    first material now and share the knowledge!{" "}
                    <span role="img" aria-label="rocket emoji">
                      🚀
                    </span>{" "}
                    <span role="img" aria-label="books emoji">
                      📚
                    </span>
                  </p>
                </div>
              ) : (
                <>
                  <div className="cardsDiv">
                    {userUploads.map((material: any) => {
                      // Determine if the file is a PDF
                      const isPdf = material.link.endsWith(".pdf");

                      // Specify the default PDF image
                      const pdfImageUrl =
                        "https://blog.idrsolutions.com/app/uploads/2020/10/pdf-1.png";
                      const defaultImageUrl = material.link;

                      // Use PDF image if it is a PDF, otherwise use the default image
                      const thumbnailUrl = isPdf
                        ? pdfImageUrl
                        : defaultImageUrl;

                      return (
                        <div key={material._id} className="card">
                          <div className="imgDiv">
                            <img src={thumbnailUrl} alt={material.name} />
                          </div>
                          <div className="cardTextBody">
                            <h4 className="materialName">{material.name}</h4>
                            <p className="materialDescription">
                              {material.description}
                            </p>
                            <div>
                              <p className="materialType">{material.type}</p>
                              <div className="buttonDiv">
                                <Button
                                  onClick={() => handleShowFile(material.link)}
                                  className="btn btn-lg"
                                  variant="dark"
                                >
                                  Show File
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <h1>
                    Thank you &hearts; for your awesome uploads! 🎉 Keep the
                    momentum going and share even more amazing materials!!
                    🚀✨📚
                  </h1>
                </>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="notLoggedInDiv">
              <h1>Oops, Seems you are not logged in yet.</h1>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Account;
