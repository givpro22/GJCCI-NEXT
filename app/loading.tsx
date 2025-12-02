"use client";

import { Card, CardContent } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-md animate-pulse">
        <CardContent className="space-y-4 py-10 text-center">
          <div className="h-4 w-3/4 bg-muted rounded mx-auto"></div>
          <div className="h-4 w-1/2 bg-muted rounded mx-auto"></div>
          <div className="h-10 w-full bg-muted rounded"></div>
        </CardContent>
      </Card>
    </div>
  );
}
