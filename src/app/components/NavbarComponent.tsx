"use client";
import Navbar from "react-bootstrap/Navbar";
import React from "react";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Link from "next/link";
const NavbarComponent = () => {
  return (
    <Navbar>
      <Link href={"/"}>
        <div className="imgDiv">
          <img
            alt=""
            src="https://res.cloudinary.com/ddxv0iwcs/image/upload/v1707926476/qbon_DEV/Screenshot_2024-02-07_at_10.04.12_AM_v8rboz.png"
            width="30"
            height="30"
            className="d-inline-block align-top"
          />
        </div>
      </Link>
      <div className="rightPart">
        <ButtonGroup aria-label="Basic example">
          <Button id="navLogin" className=" btn">
            Login
          </Button>
          <Button id="navUpload" className=" btn">
            Upload
          </Button>
        </ButtonGroup>
      </div>
    </Navbar>
  );
};

export default NavbarComponent;
