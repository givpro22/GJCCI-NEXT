"use client";

import { useState } from "react";
import { useTimer } from "@/hooks/useTimer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const PRESETS = [
  { label: "컴활 1급", min: 45 },
  { label: "컴활 2급", min: 40 },
  { label: "워드", min: 30 },
  { label: "필기", min: 60 },
] as const;

export function TimerCard() {
  const {
    mmss,
    seconds,
    running,
    setPreset,
    applyCustomTime,
    toggle,
    reset,
    beepRef,
  } = useTimer();

  const [customOpen, setCustomOpen] = useState(false);
  const [customValue, setCustomValue] = useState("");
  const [customError, setCustomError] = useState<string | null>(null);

  const handleCustomSubmit = () => {
    if (!applyCustomTime(customValue)) {
      setCustomError("올바른 형식이 아니에요. 예: 25, 10:00, 1:30");
      return;
    }
    setCustomValue("");
    setCustomError(null);
    setCustomOpen(false);
  };

  return (
    <div className="rounded-xl border bg-white/70 p-6 shadow-sm backdrop-blur dark:bg-neutral-900/70">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="shrink-0 whitespace-nowrap text-lg font-semibold">
          타이머
        </h3>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <Button
              key={p.min}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPreset(p.min)}
            >
              {p.label} ({p.min}분)
            </Button>
          ))}
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => {
              setCustomError(null);
              setCustomOpen(true);
            }}
          >
            사용자 지정
          </Button>
        </div>
      </div>

      <div className="mt-8 text-center">
        <div className="whitespace-nowrap text-7xl font-bold tabular-nums leading-none tracking-tight">
          {mmss}
        </div>

        <div className="mt-8 flex items-center justify-center gap-3">
          <Button
            type="button"
            onClick={toggle}
            disabled={seconds === 0}
            className="min-w-24"
          >
            {running ? "일시정지" : "시작"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={reset}
            disabled={seconds === 0}
          >
            리셋
          </Button>
        </div>
      </div>

      <audio
        ref={beepRef}
        src="https://actions.google.com/sounds/v1/alarms/medium_bell_ringing_near.ogg"
        preload="auto"
      />

      <Dialog
        open={customOpen}
        onOpenChange={(open) => {
          setCustomOpen(open);
          if (!open) setCustomError(null);
        }}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>사용자 지정 시간</DialogTitle>
            <DialogDescription>
              분 단위(25) 또는 분:초(10:00, 1:30) 형식으로 입력하세요.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Input
              autoFocus
              inputMode="numeric"
              value={customValue}
              onChange={(e) => {
                setCustomValue(e.target.value);
                setCustomError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCustomSubmit();
              }}
              placeholder="예: 25, 10:00, 1:30"
            />
            {customError && (
              <p className="text-sm text-destructive">{customError}</p>
            )}
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setCustomOpen(false)}>
              취소
            </Button>
            <Button onClick={handleCustomSubmit}>설정</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
