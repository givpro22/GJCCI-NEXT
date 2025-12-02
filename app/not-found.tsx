"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/constants/routes";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader>
          <CardTitle className="text-center">페이지를 찾을 수 없어요</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground text-sm">
            요청하신 게시글 또는 페이지가 존재하지 않습니다.
          </p>

          <Button asChild className="w-full">
            <Link href={ROUTES.HOME}>커뮤니티 홈으로 돌아가기</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
