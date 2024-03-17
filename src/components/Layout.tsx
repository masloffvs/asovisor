import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../app/globals.css";
import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <>
      <Toaster position="bottom-right" reverseOrder={true} />
      <main className={inter.className}>{children}</main>
    </>
  );
}
