import React from "react";
import Link from "next/link";
const Footer = () => {
  return (
    <div className="footer">
      <div className="textDiv">
        <h3>Qbon © 2024</h3>
        <h3>All Rights Reserved.</h3>
        <h3>
          Designed and Developed with <span>&hearts;</span> by{" "}
          <span>
            <Link href={"https://www.linkedin.com/in/adildyer/"}>
              AdilDyer.
            </Link>{" "}
          </span>
        </h3>
      </div>
      <div className="imgDiv">
        <img
          src="https://res.cloudinary.com/ddxv0iwcs/image/upload/v1707926485/qbon_DEV/Screenshot_2024-02-07_at_10.01.59_AM_mbeifo.png"
          alt=""
        />
      </div>
    </div>
  );
};

export default Footer;
