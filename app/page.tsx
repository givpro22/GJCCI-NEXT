"use client";

import { useEffect, useState } from "react";

import { HeroSection } from "@/components/home/HeroSection";
import { Button } from "@/components/ui";
import { TimeTools } from "@/components/home/TimeTools";
import { useSession } from "next-auth/react";

export default function page() {
  const [today, setToday] = useState("");

  const { data: session, status } = useSession();

  console.log("session:", session);
  console.log("status:", status);

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
