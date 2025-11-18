import { useEffect, useMemo, useState } from 'react';

export function NaverLikeClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const { dateStr, timeStr, weekdayStr } = useMemo(() => {
    const kst = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
    const dateStr = new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(kst);
    const weekdayStr = new Intl.DateTimeFormat('ko-KR', { weekday: 'long' }).format(kst);
    const timeStr = new Intl.DateTimeFormat('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(kst);
    return { dateStr, timeStr, weekdayStr };
  }, [now]);

  return (
    <div className='flex min-h-[240px] flex-col items-center justify-center rounded-xl border bg-white/70 p-8 text-center shadow-sm backdrop-blur dark:bg-neutral-900/70'>
      <div className='text-sm text-neutral-500 dark:text-neutral-400'>대한민국 표준시 (KST)</div>
      <div className='mt-2 text-xl font-medium'>
        {dateStr} · {weekdayStr}
      </div>
      <div className='mt-3 text-5xl font-bold tabular-nums tracking-widest md:text-6xl'>
        {timeStr}
      </div>
      <p className='mt-3 text-xs text-neutral-500'>* 네이버 시계와 동일한 KST 기반 실시간 표시</p>
    </div>
  );
}
