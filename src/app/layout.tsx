import type { Metadata } from "next";

import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import NavabarComponent from "./components/NavbarComponent";
import Footer from "./components/Footer";
import SessionWrapper from "@/app/api/auth/SessionWrapper";
export const metadata: Metadata = {
  title: "Qbon",
  description: "The Question bank of the NFSU.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionWrapper>
      <html lang="en">
        <head>
          <link
            rel="icon"
            href="https://upload.wikimedia.org/wikipedia/en/9/96/National_Forensic_Sciences_University_Logo.png"
          />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
            rel="stylesheet"
          />
        </head>
        <body>
          <NavabarComponent />
          {children}
          <Footer />
        </body>
      </html>
    </SessionWrapper>
  );
}
