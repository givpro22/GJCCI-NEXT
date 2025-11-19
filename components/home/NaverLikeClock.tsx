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
      const now = new Date();

      // KST 기준으로 바로 포맷 (toLocaleString + new Date 문자열 파싱은 굳이 안 써도 됨)
      const kstOptions: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Seoul",
      };

      const kst = new Date(
        now.toLocaleString("en-US", { timeZone: "Asia/Seoul" })
      );

      const dateStr = new Intl.DateTimeFormat("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        ...kstOptions,
      }).format(kst);

      const weekdayStr = new Intl.DateTimeFormat("ko-KR", {
        weekday: "long",
        ...kstOptions,
      }).format(kst);

      const timeStr = new Intl.DateTimeFormat("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        ...kstOptions,
      }).format(kst);

      setClock({ dateStr, timeStr, weekdayStr });
    };

    update(); // 첫 렌더 직후 한 번
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const dateStr = clock?.dateStr ?? "\u00A0";
  const timeStr = clock?.timeStr ?? "\u00A0";
  const weekdayStr = clock?.weekdayStr ?? "\u00A0";

  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center rounded-xl border bg-white/70 p-8 text-center shadow-sm backdrop-blur dark:bg-neutral-900/70">
      <div className="text-sm text-neutral-500 dark:text-neutral-400">
        대한민국 표준시 (KST)
      </div>
      <div className="mt-2 text-xl font-medium">
        {dateStr} · {weekdayStr}
      </div>
      <div className="mt-3 text-5xl font-bold tabular-nums tracking-widest md:text-6xl">
        {timeStr}
      </div>
      <p className="mt-3 text-xs text-neutral-500">
        * 네이버 시계와 동일한 KST 기반 실시간 표시
      </p>
    </div>
  );
}
