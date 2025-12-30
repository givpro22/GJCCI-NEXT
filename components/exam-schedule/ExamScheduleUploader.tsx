"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useRef, useState } from "react";
import { createClientSideSupabaseClient } from "@/utils/supabase/client";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { toast } from "sonner";

type UploadedImage = {
  id: string;
  name: string;
  size: number;
  file: File;
  url: string;
  path?: string;
  uploadedUrl?: string;
};

export default function ExamScheduleUploader({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [preview, setPreview] = useState<UploadedImage | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [uploading, setUploading] = useState(false);

  const openFilePicker = () => inputRef.current?.click();

  const onSelectFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    setImages([
      {
        id: crypto.randomUUID(),
        name: file.name,
        size: file.size,
        file,
        url: URL.createObjectURL(file),
      },
    ]);

    e.target.value = "";
  };

  const uploadToSupabase = async (img: UploadedImage) => {
    if (!dateRange?.from || !dateRange?.to) return;

    setUploading(true);

    try {
      const supabase = createClientSideSupabaseClient();
      const bucket = process.env.NEXT_PUBLIC_STORAGE_BUCKET!;
      const fileExt = img.name.split(".").pop();

      const fromKey = format(dateRange.from, "yyyy-MM-dd");
      const toKey = format(dateRange.to, "yyyy-MM-dd");
      const filePath = `exam-images/${fromKey}_${toKey}/schedule.${fileExt}`;

      const { error } = await supabase.storage
        .from(bucket)
        .upload(filePath, img.file, { upsert: true });

      if (error) throw error;

      toast.info("시험 일정표가 성공적으로 업로드되었습니다.");

      onSuccess?.();
    } catch (e) {
      toast.error("일정표 업로드 중 오류가 발생했습니다.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">시험 일정표 이미지 업로드</h2>
        <p className="text-sm text-muted-foreground">
          이미지 파일을 선택한 후 업로드 버튼을 눌러주세요.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[200px] justify-start">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from && dateRange?.to
                ? `${format(dateRange.from, "yyyy-MM-dd")} ~ ${format(
                    dateRange.to,
                    "yyyy-MM-dd"
                  )}`
                : "기간 선택"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={setDateRange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex gap-2">
        <Input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onSelectFiles}
        />
        <Button onClick={openFilePicker} disabled={images.length === 1}>
          파일 선택
        </Button>
        <Button
          variant="secondary"
          disabled={
            uploading ||
            images.length === 0 ||
            !dateRange?.from ||
            !dateRange?.to
          }
          onClick={async () => {
            await uploadToSupabase(images[0]);
          }}
        >
          {uploading ? "업로드 중..." : "업로드"}
        </Button>
      </div>

      {/* 갤러리 */}
      <ScrollArea className="h-[300px]">
        <div className="grid grid-cols-3 gap-3">
          {images.slice(0, 1).map((img) => (
            <img
              key={img.id}
              src={img.uploadedUrl ?? img.url}
              className="rounded border cursor-pointer"
              onClick={() => setPreview(img)}
            />
          ))}
        </div>
      </ScrollArea>

      <Dialog open={!!preview} onOpenChange={() => setPreview(null)}>
        <DialogContent>
          {preview && (
            <img src={preview.uploadedUrl ?? preview.url} className="w-full" />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
