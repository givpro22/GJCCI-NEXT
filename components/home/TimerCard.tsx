import { useTimer } from "@/hooks/useTimer";
export function TimerCard() {
  const {
    mmss,
    seconds,
    running,
    setPreset,
    setCustom,
    toggle,
    reset,
    beepRef,
  } = useTimer();

  return (
    <div className="rounded-xl border bg-white/70 p-6 shadow-sm backdrop-blur dark:bg-neutral-900/70">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="shrink-0 whitespace-nowrap text-lg font-semibold">
          타이머
        </h3>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setPreset(45)}
            className="rounded-md border px-3 py-1.5 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800"
          >
            컴활 1급 (45분)
          </button>
          <button
            type="button"
            onClick={() => setPreset(40)}
            className="rounded-md border px-3 py-1.5 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800"
          >
            컴활 2급 (40분)
          </button>
          <button
            type="button"
            onClick={() => setPreset(30)}
            className="rounded-md border px-3 py-1.5 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800"
          >
            워드 (30분)
          </button>
          <button
            type="button"
            onClick={() => setPreset(60)}
            className="rounded-md border px-3 py-1.5 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800"
          >
            필기 (60분)
          </button>
          <button
            type="button"
            onClick={setCustom}
            className="rounded-md border px-3 py-1.5 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800"
          >
            사용자 지정
          </button>
        </div>
      </div>

      <div className="mt-6 text-center">
        <div className="whitespace-nowrap text-6xl font-bold tabular-nums leading-none">
          {mmss}
        </div>
        <p className="mt-2 text-xs text-neutral-500">
          현재 설정: {/* 분,초 계산은 mmss로 충분하므로 생략 가능 */}
        </p>

        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={toggle}
            className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800"
            disabled={seconds === 0}
          >
            {running ? "일시정지" : "시작"}
          </button>
          <button
            type="button"
            onClick={reset}
            className="rounded-md border px-4 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800"
            disabled={seconds === 0}
          >
            리셋
          </button>
        </div>
      </div>

      <audio
        ref={beepRef}
        src="https://actions.google.com/sounds/v1/alarms/medium_bell_ringing_near.ogg"
        preload="auto"
      />
    </div>
  );
}
