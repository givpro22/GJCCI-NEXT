"use client";

import { useEffect, useRef, useState } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { MessageCircle, Pencil, Send, Users, X } from "lucide-react";
import { createClientSideSupabaseClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const EXAM_TYPES = ["필기", "실기"] as const;
const ROLES = ["정감독", "부감독"] as const;

const CHANNEL = "proctor-chat";
const IDENTITY_KEY = "proctor-chat-identity";

type Identity = { exam: string; role: string };

type ChatMessage = {
  id: string;
  senderId: string;
  name: string;
  text: string;
  at: number;
};

function labelOf(identity: Identity) {
  return `${identity.exam} · ${identity.role}`;
}

function formatTime(at: number) {
  return new Date(at).toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// 새 메시지 알림용 짧은 비프음 (에셋 없이 Web Audio 사용)
function playBeep() {
  try {
    const Ctx =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 660;
    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
    osc.onended = () => ctx.close();
  } catch {
    // 오디오가 막힌 환경이면 조용히 무시
  }
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [onlineCount, setOnlineCount] = useState(0);
  const [unread, setUnread] = useState(0);
  const [text, setText] = useState("");

  // 설정 폼 임시 선택값
  const [examSel, setExamSel] = useState<string>("필기");
  const [roleSel, setRoleSel] = useState<string>("부감독");
  const [editing, setEditing] = useState(false); // 신원 재설정 중인지

  // 세션 발신자 ID — 렌더에 노출되지 않으므로 lazy init로 1회 생성
  const [senderId] = useState(() => crypto.randomUUID());
  const channelRef = useRef<RealtimeChannel | null>(null);
  const openRef = useRef(open);
  const listEndRef = useRef<HTMLDivElement | null>(null);

  // 마운트: 저장된 신원을 localStorage에서 복원 (클라이언트 전용)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(IDENTITY_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- 클라이언트 저장값 복원
      if (saved) setIdentity(JSON.parse(saved) as Identity);
    } catch {
      // 파싱 실패 시 무시
    }
  }, []);

  // 신원이 있으면 실시간 채널 구독 (접속자 집계 + 메시지 수신)
  useEffect(() => {
    if (!identity || !senderId) return;

    const supabase = createClientSideSupabaseClient();
    const channel = supabase.channel(CHANNEL, {
      config: { presence: { key: senderId } },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        setOnlineCount(Object.keys(channel.presenceState()).length);
      })
      .on("broadcast", { event: "message" }, ({ payload }) => {
        const msg = payload as ChatMessage;
        if (msg.senderId === senderId) return; // 내 메시지는 이미 표시됨
        setMessages((prev) => [...prev, msg]);
        if (!openRef.current) {
          setUnread((n) => n + 1);
          playBeep();
        }
      })
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          channel.track({ name: labelOf(identity), at: Date.now() });
        }
      });

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [identity, senderId]);

  // 새 메시지 오면 맨 아래로 스크롤
  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 패널 토글 — openRef 동기화(브로드캐스트 핸들러가 참조) + 열 때 안읽음 초기화
  const openPanel = () => {
    openRef.current = true;
    setUnread(0);
    setOpen(true);
  };
  const closePanel = () => {
    openRef.current = false;
    setOpen(false);
  };

  const handleJoin = () => {
    const next: Identity = { exam: examSel, role: roleSel };
    // 신원이 바뀌면 구독 effect가 재실행되어 presence 라벨도 갱신됨
    setIdentity(next);
    setEditing(false);
    try {
      localStorage.setItem(IDENTITY_KEY, JSON.stringify(next));
    } catch {
      // 저장 실패해도 세션 내에서는 동작
    }
  };

  const startEdit = () => {
    if (identity) {
      setExamSel(identity.exam);
      setRoleSel(identity.role);
    }
    setEditing(true);
  };

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || !identity || !channelRef.current) return;

    const msg: ChatMessage = {
      id: crypto.randomUUID(),
      senderId,
      name: labelOf(identity),
      text: trimmed,
      at: Date.now(),
    };

    setMessages((prev) => [...prev, msg]); // 낙관적 표시
    channelRef.current.send({
      type: "broadcast",
      event: "message",
      payload: msg,
    });
    setText("");
  };

  return (
    <>
      {/* 플로팅 버튼 */}
      {!open && (
        <button
          type="button"
          onClick={openPanel}
          aria-label="채팅 열기"
          className={cn(
            "fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition hover:scale-105",
            unread > 0 && "animate-pulse"
          )}
        >
          <MessageCircle className="h-6 w-6" />
          {unread > 0 && (
            <span className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold text-white">
              {unread > 99 ? "99+" : unread}
            </span>
          )}
        </button>
      )}

      {/* 채팅 패널 */}
      {open && (
        <div className="fixed bottom-5 right-5 z-50 flex h-[70vh] max-h-[560px] w-[92vw] max-w-sm flex-col overflow-hidden rounded-2xl border bg-background shadow-2xl">
          {/* 헤더 */}
          <div className="flex items-center justify-between border-b bg-muted/40 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">감독관 채팅</span>
              {identity && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  <Users className="h-3 w-3" />
                  {onlineCount}명 접속
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {identity && !editing && (
                <button
                  type="button"
                  onClick={startEdit}
                  aria-label="구분·역할 수정"
                  className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground transition hover:bg-muted hover:text-foreground"
                >
                  <Pencil className="h-3 w-3" />
                  {labelOf(identity)}
                </button>
              )}
              <button
                type="button"
                onClick={closePanel}
                aria-label="채팅 닫기"
                className="text-muted-foreground transition hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {!identity || editing ? (
            /* 채팅 전 신원 설정 / 신원 수정 */
            <div className="flex flex-1 flex-col justify-center gap-5 p-6">
              <div className="space-y-1 text-center">
                <p className="text-sm font-medium">
                  {editing ? "구분·역할 변경" : "채팅에 참여하려면"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {editing
                    ? "변경할 구분과 역할을 선택하세요."
                    : "구분과 역할을 먼저 선택하세요."}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">구분</p>
                <div className="grid grid-cols-2 gap-2">
                  {EXAM_TYPES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setExamSel(t)}
                      className={cn(
                        "rounded-lg border py-2 text-sm transition",
                        examSel === t
                          ? "border-primary bg-primary/10 font-semibold text-primary"
                          : "hover:bg-muted"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">역할</p>
                <div className="grid grid-cols-2 gap-2">
                  {ROLES.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRoleSel(r)}
                      className={cn(
                        "rounded-lg border py-2 text-sm transition",
                        roleSel === r
                          ? "border-primary bg-primary/10 font-semibold text-primary"
                          : "hover:bg-muted"
                      )}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-2 flex gap-2">
                {editing && (
                  <Button
                    variant="ghost"
                    className="flex-1"
                    onClick={() => setEditing(false)}
                  >
                    취소
                  </Button>
                )}
                <Button onClick={handleJoin} className="flex-1">
                  {editing ? "변경 저장" : `${examSel} · ${roleSel}(으)로 참여`}
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* 메시지 목록 */}
              <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
                {messages.length === 0 ? (
                  <p className="mt-8 text-center text-xs text-muted-foreground">
                    아직 메시지가 없어요. 첫 메시지를 남겨보세요.
                  </p>
                ) : (
                  messages.map((m) => {
                    const mine = m.senderId === senderId;
                    return (
                      <div
                        key={m.id}
                        className={cn(
                          "flex flex-col",
                          mine ? "items-end" : "items-start"
                        )}
                      >
                        <span className="mb-0.5 px-1 text-[11px] text-muted-foreground">
                          {mine ? "나" : m.name} · {formatTime(m.at)}
                        </span>
                        <div
                          className={cn(
                            "max-w-[80%] whitespace-pre-wrap wrap-break-word rounded-2xl px-3 py-2 text-sm",
                            mine
                              ? "rounded-br-sm bg-primary text-primary-foreground"
                              : "rounded-bl-sm bg-muted text-foreground"
                          )}
                        >
                          {m.text}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={listEndRef} />
              </div>

              {/* 입력창 */}
              <div className="flex items-center gap-2 border-t p-3">
                <Input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="메시지 입력..."
                  className="flex-1"
                />
                <Button
                  size="icon"
                  onClick={handleSend}
                  disabled={!text.trim()}
                  aria-label="전송"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
