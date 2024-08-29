"use client";
import Navbar from "react-bootstrap/Navbar";
import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Link from "next/link";
import Modal from "react-bootstrap/Modal";
import { signIn, useSession } from "next-auth/react";

const NavbarComponent = () => {
  const [showModalOne, setShowModalOne] = useState(false);
  const handleCloseModalOne = () => setShowModalOne(false);
  const handleShowModalOne = () => setShowModalOne(true);
  const [showModalTwo, setShowModalTwo] = useState(false);
  const handleCloseModalTwo = () => setShowModalTwo(false);
  const handleShowModalTwo = () => setShowModalTwo(true);
  const { data: session } = useSession();
  return (
    <>
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
            {!session?.user ? (
              <>
                <Button
                  onClick={handleShowModalOne}
                  id="navLogin"
                  className="btn"
                >
                  Login
                </Button>
                <Button
                  onClick={handleShowModalTwo}
                  id="navUpload"
                  className="btn"
                >
                  Upload
                </Button>
              </>
            ) : (
              <>
                {session?.user?.isAdmin && (
                  <Link href={"/admin"}>
                    <div className="adminImg">
                      <img
                        src="https://res.cloudinary.com/ddxv0iwcs/image/upload/v1712834949/admin_rsgkmd.png"
                        alt=""
                      />
                    </div>
                  </Link>
                )}

                <Link href={"/account"}>
                  <Button className="btn" id="navLogin">
                    <img src={session?.user?.image!} alt="" />
                  </Button>
                </Link>
                <Link href={"/upload"} id="navUploadLink">
                  <Button id="navUpload" className=" btn">
                    Upload
                  </Button>
                </Link>
              </>
            )}
          </ButtonGroup>
        </div>
      </Navbar>
      <Modal
        show={showModalOne}
        onHide={handleCloseModalOne}
        className="loginModal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Login to Qbon using :</Modal.Title>
        </Modal.Header>
        <Button
          onClick={() => signIn("google")}
          variant="light"
          className="loginUsingGoogleBtn"
        >
          <img
            src="https://w7.pngwing.com/pngs/63/1016/png-transparent-google-logo-google-logo-g-suite-chrome-text-logo-chrome.png"
            alt=""
          />
          Login using Google
        </Button>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseModalOne}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showModalTwo}
        onHide={handleCloseModalTwo}
        className="uploadNotPossibleModal loginModal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Sorry, could not proceed to upload :</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h6>Please login to upload files.</h6>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseModalTwo}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default NavbarComponent;
