"use client";

import { useEffect, useState } from "react";

type ClockState = {
  dateStr: string;
  timeStr: string;
  weekdayStr: string;
} | null;

export function NaverLikeClock() {
  const [clock, setClock] = useState<ClockState>(null);

  useEffect(() => {
    const update = () => {
      const now = new Date(); // 사용자의 현재 시각

      // 한국 시간(KST) 포맷 설정을 한 번만 정의
      const kstFormatter = (options: Intl.DateTimeFormatOptions) =>
        new Intl.DateTimeFormat("ko-KR", {
          ...options,
          timeZone: "Asia/Seoul", // 이 설정이 핵심입니다.
        }).format(now);

      const dateStr = kstFormatter({
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      const weekdayStr = kstFormatter({ weekday: "long" });

      const timeStr = kstFormatter({
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });

      setClock({ dateStr, timeStr, weekdayStr });
    };

    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  // 초기 로딩 시 레이아웃 깨짐 방지
  if (!clock) return <div className="min-h-[240px]" />;

  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center rounded-xl border bg-white/70 p-8 text-center shadow-sm backdrop-blur dark:bg-neutral-900/70">
      <div className="text-sm text-neutral-500 dark:text-neutral-400">
        대한민국 표준시 (KST)
      </div>
      <div className="mt-2 text-xl font-medium">
        {clock.dateStr} · {clock.weekdayStr}
      </div>
      <div className="mt-3 text-5xl font-bold tabular-nums tracking-widest md:text-6xl">
        {clock.timeStr}
      </div>
      <p className="mt-3 text-xs text-neutral-500">
        * 접속 기기의 시계를 기준으로 KST 시간을 표시합니다.
      </p>
    </div>
  );
}
