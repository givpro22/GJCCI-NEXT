"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader>
          <CardTitle className="text-center">문제가 발생했어요</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-muted-foreground text-sm">
            {error?.message ?? "알 수 없는 오류가 발생했습니다."}
          </p>

          <Button onClick={() => reset()} className="w-full">
            다시 시도하기
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
