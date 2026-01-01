"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "../ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES, CategoryId } from "@/lib/definitions";

export default function Composer({
  value,
  onChange,
  onSubmit,
  title,
  onTitleChange,
  anonymous,
  onToggleAnonymous,
  category,
  onCategoryChange,
  open,
  onOpenChange,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  title: string;
  onTitleChange: (v: string) => void;
  anonymous: boolean;
  onToggleAnonymous: () => void;
  category: CategoryId;
  onCategoryChange: (v: CategoryId) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>글 작성하기</Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>게시글 작성</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <Select
            value={category}
            onValueChange={(v) => onCategoryChange(v as CategoryId)}
          >
            <SelectTrigger>
              <SelectValue placeholder="카테고리를 선택해주세요" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.filter((c) => c.id !== "all").map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            type="text"
            placeholder="제목을 입력해주세요"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
          />

          <Textarea
            placeholder="커뮤니티에 공유할 내용을 입력해 주세요."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="min-h-[120px]"
          />

          <div className="flex items-center gap-2 text-sm">
            <Switch checked={anonymous} onCheckedChange={onToggleAnonymous} />
            <span>익명으로 작성하기</span>
          </div>

          <div className="flex justify-end">
            <Button onClick={onSubmit}>게시하기</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
