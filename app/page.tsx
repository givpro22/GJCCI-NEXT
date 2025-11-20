"use client";

import { useEffect, useState } from "react";

import { HeroSection } from "@/components/home/HeroSection";
import { Button } from "@/components/ui";
import { TimeTools } from "@/components/home/TimeTools";

export default function page() {
  const [today, setToday] = useState("");

  useEffect(() => {
    setToday(new Date().toLocaleDateString());
  }, []);

  return (
    <>
      <HeroSection />

      <TimeTools />

      {/* <SupportBand /> */}
      {/* <Footer /> */}
    </>
  );
}
