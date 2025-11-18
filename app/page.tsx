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
      <div className="flex justify-center gap-4">
        <Button size="lg" onClick={() => alert("개발중")}>
          {today} 시험 일정 확인
        </Button>
        <Button size="lg" onClick={() => alert("개발중")}>
          카메라 연결 확인
        </Button>
      </div>
      <TimeTools />

      {/* <SupportBand /> */}
      {/* <Footer /> */}
    </>
  );
}
