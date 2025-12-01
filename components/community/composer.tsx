"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export default function Composer({
  value,
  onChange,
  onSubmit,
  title,
  onTitleChange,
  anonymous,
  onToggleAnonymous,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  title: string;
  onTitleChange: (v: string) => void;
  anonymous: boolean;
  onToggleAnonymous: () => void;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-3 space-y-0">
        <Avatar className="h-10 w-10">
          <AvatarImage src="" alt="me" />
          <AvatarFallback>ME</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-base">편하게 글을 남겨주세요</CardTitle>
          <CardDescription>
            업무 관련 정보 공유, 질문, 소통 모두 환영합니다.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <input
          type="text"
          placeholder="제목을 입력해주세요"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="w-full rounded-md border px-3 py-2 text-sm"
        />
        <Textarea
          placeholder="커뮤니티에 공유할 내용을 입력해 주세요."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-[90px] resize-none"
        />
        <div className="flex items-center gap-2 text-sm pt-1">
          <Switch checked={anonymous} onCheckedChange={onToggleAnonymous} />
          <span>익명으로 작성하기</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="outline">텍스트</Badge>
            <span>나중에 이미지/파일 업로드 기능을 추가할 수 있어요.</span>
          </div>
          <Button size="sm" onClick={onSubmit}>
            게시하기
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
