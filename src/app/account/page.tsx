"use client";
import { signOut, useSession } from "next-auth/react";
import React from "react";
import Button from "react-bootstrap/Button";
const Account = () => {
  const { data: session } = useSession();
  return (
    <>
      <div>{session ? JSON.stringify(session) : "Not logged in"}</div>;
      <Button variant="primary" onClick={() => signOut({ callbackUrl: "/" })}>
        signOut
      </Button>
    </>
  );
};

export default Account; 
