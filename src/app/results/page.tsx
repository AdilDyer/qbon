"use client";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";

const ResultsPage = () => {
  const searchParams = useSearchParams();
  const school = searchParams.get("school") || "";
  const course = searchParams.get("course") || "";
  const semester = searchParams.get("semester") || "";
  const subject = searchParams.get("subject") || "";
  const materialType = searchParams.get("materialType") || "";

  const [allMaterials, setAllMaterials] = useState([]);

  useEffect(() => {
    async function fetchAllMaterials() {
      try {
        const res = await fetch("/api/getAllMaterials", {
          method: "POST",
          body: JSON.stringify({
            isAdmin: false,
            school,
            course,
            semester,
            subject,
            materialType,
          }),
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
    fetchAllMaterials();
  }, []);

  const handleShowFile = (link: string | URL) => {
    window.open(link, "_blank");
  };
  return (
    <div className="resultPageDiv">
      {allMaterials.length === 0 ? (
        <div className="noDataUploadedDiv">
          <h3>Oops, nothing as of now ! &#128557;</h3>
          <br />
          <h4>
            Currently No materials📚 has been uploaded for the given Subject.
          </h4>
          <br />
          <h4>
            Be the Hero/Heroine who saves the day by uploading some epic
            resources over here. 📚💪
          </h4>
        </div>
      ) : (
        <>
          <div className="resultsDiv">
            <h1>
              <span>
                {allMaterials.length}
                {allMaterials.length === 1 ? " result " : " results "}
                found :
              </span>
            </h1>
            <div className="cardsDiv">
              {allMaterials.map((material: any) => {
                // Determine if the file is a PDF
                const isPdf = material.link.endsWith(".pdf");

                // Specify the default PDF image
                const pdfImageUrl =
                  "https://blog.idrsolutions.com/app/uploads/2020/10/pdf-1.png";
                const defaultImageUrl = material.link;

                // Use PDF image if it is a PDF, otherwise use the default image
                const thumbnailUrl = isPdf ? pdfImageUrl : defaultImageUrl;

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
          </div>
        </>
      )}
    </div>
  );
};

export default ResultsPage;