"use client";

import ExamScheduleUploader from "@/components/exam-schedule/ExamScheduleUploader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
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

export default function ExamSchedulePage() {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const fetchImages = async () => {
    if (!dateRange?.from || !dateRange?.to) return;

    setLoading(true);
    const supabase = createClientSideSupabaseClient();
    const bucket = process.env.NEXT_PUBLIC_STORAGE_BUCKET!;

    const urls: string[] = [];

    // 모든 기간 폴더 조회
    const { data: folders } = await supabase.storage
      .from(bucket)
      .list("exam-images");

    if (!folders) {
      setImages([]);
      setLoading(false);
      return;
    }

    // 각 폴더 검사
    for (const folder of folders) {
      if (!folder.name.includes("_")) continue;

      const [fromStr, toStr] = folder.name.split("_");
      const from = new Date(fromStr);
      const to = new Date(toStr);

      // 선택한 날짜 범위와 겹치는지 검사
      if (dateRange.to < from || dateRange.from > to) {
        continue;
      }

      // 해당 폴더의 이미지 가져오기
      const { data: files } = await supabase.storage
        .from(bucket)
        .list(`exam-images/${folder.name}`);

      if (!files) continue;

      files.forEach((file) => {
        const { data } = supabase.storage
          .from(bucket)
          .getPublicUrl(`exam-images/${folder.name}/${file.name}`);

        if (data?.publicUrl) {
          urls.push(data.publicUrl);
        }
      });
    }

    setImages(urls);
    setLoading(false);
  };

  const handleDeleteImage = async () => {
    if (!previewImage) return;

    const supabase = createClientSideSupabaseClient();
    const bucket = process.env.NEXT_PUBLIC_STORAGE_BUCKET!;

    try {
      // publicUrl 에서 storage 경로 추출
      const url = new URL(previewImage);
      const pathname = url.pathname;
      // /storage/v1/object/public/{bucket}/exam-images/xxx/yyy.png
      const idx = pathname.indexOf(`/${bucket}/`);
      if (idx === -1) return;

      const filePath = pathname.substring(idx + bucket.length + 2); // exam-images/...

      const { error } = await supabase.storage.from(bucket).remove([filePath]);

      if (error) {
        console.error(error);
        toast.error("이미지 삭제에 실패했습니다.");
        return;
      }
      toast.info("이미지가 삭제되었습니다.");

      // UI 갱신
      setPreviewImage(null);
      fetchImages();
    } catch (e) {
      console.error(e);
      toast.error("이미지 삭제 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    const today = new Date();

    const start = new Date(today);
    start.setHours(0, 0, 0, 0);

    const end = new Date(today);
    end.setHours(23, 59, 59, 999);

    setDateRange({ from: start, to: end });
  }, []);

  useEffect(() => {
    if (!dateRange?.from || !dateRange?.to) return;
    fetchImages();
  }, [dateRange]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">시험 일정표</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>일정 업로드</Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>일정 업로드</DialogTitle>
            </DialogHeader>
            <ExamScheduleUploader
              onSuccess={() => {
                setOpen(false);
                fetchImages();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[250px] justify-start">
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
            />
          </PopoverContent>
        </Popover>
      </div>

      {loading ? (
        <div className="text-muted-foreground">일정표 불러오는 중...</div>
      ) : images.length === 0 ? (
        <div className="rounded border p-6 text-muted-foreground">
          업로드된 일정표가 없습니다.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((url) => (
            <img
              key={url}
              src={url}
              onClick={() => setPreviewImage(url)}
              className="rounded border object-contain aspect-[3/4] bg-white cursor-pointer hover:opacity-80 transition"
            />
          ))}
        </div>
      )}

      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>일정표 미리보기</DialogTitle>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="destructive" onClick={handleDeleteImage}>
              삭제
            </Button>
          </div>

          <div className="max-h-[80vh] overflow-auto flex justify-center">
            {previewImage && (
              <img src={previewImage} className="object-contain" />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
