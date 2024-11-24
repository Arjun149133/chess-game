import Sidebar from "@/components/Sidebar";
import React from "react";

export default function PlayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className=" grid grid-cols-12 max-h-screen">
      <div className=" col-span-2">
        <Sidebar />
      </div>
      {children}
    </div>
  );
}
