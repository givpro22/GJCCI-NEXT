import { useEffect, useMemo, useRef, useState } from "react";

// Timer hook with deadline-based ticking and improved accuracy

export function useTimer() {
  const deadlineRef = useRef<number | null>(null);
  const prevRemainingRef = useRef<number>(0);
  const halfTriggeredRef = useRef(false);
  const warningTriggeredRef = useRef(false);

  const [seconds, setSeconds] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [running, setRunning] = useState(false);
  const [flash, setFlash] = useState(false);
  const [halfFlash, setHalfFlash] = useState(false);
  const [warningFlash, setWarningFlash] = useState(false);
  const beepRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!running || remaining <= 0) return;

    // Ensure deadline exists when (re)starting
    if (deadlineRef.current == null) {
      deadlineRef.current = Date.now() + remaining * 1000;
    }

    const id = setInterval(() => {
      if (deadlineRef.current == null) return;

      const msLeft = deadlineRef.current - Date.now();
      const next = Math.max(0, Math.ceil(msLeft / 1000));

      // fire one-time threshold events even if ticks were throttled
      const halfThreshold = Math.floor(seconds / 2);
      if (
        !halfTriggeredRef.current &&
        prevRemainingRef.current > halfThreshold &&
        next <= halfThreshold
      ) {
        setHalfFlash(true);
        halfTriggeredRef.current = true;
      }
      if (
        !warningTriggeredRef.current &&
        prevRemainingRef.current > 90 &&
        next <= 90
      ) {
        setWarningFlash(true);
        warningTriggeredRef.current = true;
      }

      prevRemainingRef.current = next;

      if (next <= 0) {
        setRunning(false);
        setFlash(true);
        deadlineRef.current = null;
        setRemaining(0);
        setTimeout(() => {
          try {
            if (beepRef.current) {
              beepRef.current.currentTime = 0;
              beepRef.current.play().catch(() => {});
            }
          } catch {}
          if (
            "Notification" in window &&
            Notification.permission === "granted"
          ) {
            new Notification("타이머 완료", {
              body: "설정한 시간이 완료되었습니다.",
            });
          }
        }, 0);
        return;
      }

      // only update when it actually changes to avoid excessive renders
      setRemaining((r) => (r !== next ? next : r));
    }, 500); // 500ms 간격으로 계산 (크롬 백그라운드에서도 deadline 기반이라 정확함)

    return () => clearInterval(id);
  }, [running, remaining, seconds]);

  useEffect(() => {
    if (!flash) return;
    const originalBg = document.body.style.backgroundColor;
    let count = 0;
    const id = setInterval(() => {
      document.body.style.backgroundColor =
        document.body.style.backgroundColor === "red" ? originalBg : "red";
      count++;
      if (count >= 8) {
        clearInterval(id);
        document.body.style.backgroundColor = originalBg;
        setFlash(false);
      }
    }, 500);
    return () => {
      clearInterval(id);
      document.body.style.backgroundColor = originalBg;
    };
  }, [flash]);

  useEffect(() => {
    if (!halfFlash) return;
    const originalBg = document.body.style.backgroundColor;
    let count = 0;
    const id = setInterval(() => {
      document.body.style.backgroundColor =
        document.body.style.backgroundColor === "blue" ? originalBg : "blue";
      count++;
      if (count >= 8) {
        clearInterval(id);
        document.body.style.backgroundColor = originalBg;
        setHalfFlash(false);
      }
    }, 500);
    return () => {
      clearInterval(id);
      document.body.style.backgroundColor = originalBg;
    };
  }, [halfFlash]);

  useEffect(() => {
    if (!warningFlash) return;
    const originalBg = document.body.style.backgroundColor;
    let count = 0;
    const id = setInterval(() => {
      document.body.style.backgroundColor =
        document.body.style.backgroundColor === "green" ? originalBg : "green";
      count++;
      if (count >= 8) {
        clearInterval(id);
        document.body.style.backgroundColor = originalBg;
        setWarningFlash(false);
      }
    }, 500);
    return () => {
      clearInterval(id);
      document.body.style.backgroundColor = originalBg;
    };
  }, [warningFlash]);

  const mmss = useMemo(() => {
    const m = Math.floor(remaining / 60)
      .toString()
      .padStart(2, "0");
    const s = Math.floor(remaining % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  }, [remaining]);

  function ensureNotifyPermission() {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().catch(() => {});
    }
  }

  function setPreset(min: number) {
    const total = Math.max(0, Math.round(min * 60));
    setSeconds(total);
    setRemaining(total);
    prevRemainingRef.current = total;
    halfTriggeredRef.current = false;
    warningTriggeredRef.current = false;
    deadlineRef.current = null;
    setRunning(false);
    ensureNotifyPermission();
  }

  function setCustom() {
    const v = window.prompt("타이머 시간을 입력하세요 (예: 25, 10:00, 1:30)");
    if (!v) return;
    const parts = v.split(":");
    let total = 0;
    if (parts.length === 1) {
      const min = Number(parts[0]);
      if (Number.isFinite(min) && min >= 0) total = Math.round(min * 60);
    } else if (parts.length === 2) {
      const min = Number(parts[0]);
      const sec = Number(parts[1]);
      if (
        Number.isFinite(min) &&
        Number.isFinite(sec) &&
        min >= 0 &&
        sec >= 0
      ) {
        total = Math.round(min * 60 + sec);
      }
    }
    if (total > 0) {
      setSeconds(total);
      setRemaining(total);
      prevRemainingRef.current = total;
      halfTriggeredRef.current = false;
      warningTriggeredRef.current = false;
      deadlineRef.current = null;
      setRunning(false);
      ensureNotifyPermission();
    } else {
      alert("입력 형식이 올바르지 않습니다.");
    }
  }

  function toggle() {
    if (remaining <= 0 && seconds > 0) {
      // 재시작 시 남은 시간을 초기화
      setRemaining(seconds);
      prevRemainingRef.current = seconds;
      halfTriggeredRef.current = false;
      warningTriggeredRef.current = false;
      deadlineRef.current = Date.now() + seconds * 1000;
      setRunning(true);
      return;
    }

    setRunning((r) => {
      const nextRunning = !r;
      if (nextRunning) {
        // 시작 시점에 정확한 마감시각 설정
        const base = remaining > 0 ? remaining : seconds;
        deadlineRef.current = Date.now() + base * 1000;
        prevRemainingRef.current = base;
      } else {
        // 일시정지: 현재 남은 시간을 기준으로 deadline 제거
        deadlineRef.current = null;
      }
      return nextRunning;
    });
  }

  function reset() {
    setRunning(false);
    setRemaining(seconds);
    prevRemainingRef.current = seconds;
    halfTriggeredRef.current = false;
    warningTriggeredRef.current = false;
    deadlineRef.current = null;
  }

  useEffect(() => {
    function onVisibility() {
      if (
        document.visibilityState === "visible" &&
        running &&
        deadlineRef.current != null
      ) {
        const msLeft = deadlineRef.current - Date.now();
        const next = Math.max(0, Math.ceil(msLeft / 1000));
        prevRemainingRef.current = next;
        setRemaining(next);
      }
    }
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [running]);

  return {
    mmss,
    seconds,
    remaining,
    running,
    setPreset,
    setCustom,
    toggle,
    reset,
    beepRef,
  };
}
