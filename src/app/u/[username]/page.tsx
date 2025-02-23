"use client";
import { useParams } from "next/navigation";
import React from "react";

const page = () => {
  const { username } = useParams();
  return (
    <div>
      <h1>Send anonymous messaage to the following creator, {username}</h1>
      
    </div>
  );
};

export default page;
