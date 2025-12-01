"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, MessageCircle } from "lucide-react";

type Post = {
  id: number;
  author: string;
  avatar?: string;
  category: string;
  title: string;
  content: string;
  createdAt: string;
  likes: number;
  comments: number;
};

export default function PostCard({
  post,
  categoryLabel,
}: {
  post: Post;
  categoryLabel?: string;
}) {
  return (
    <Card className="border-border/70">
      <CardHeader className="flex flex-row items-start gap-3 space-y-0">
        <Avatar className="h-9 w-9">
          <AvatarImage src={post.avatar ?? ""} alt={post.author} />
          <AvatarFallback>{post.author.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm font-semibold">
              {post.author}
            </CardTitle>
            {categoryLabel && (
              <Badge variant="secondary" className="text-[10px]">
                {categoryLabel}
              </Badge>
            )}
          </div>
          <CardDescription className="text-xs">
            {post.createdAt}
          </CardDescription>
          <div className="mt-1 text-sm font-medium">{post.title}</div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm leading-relaxed text-muted-foreground">
          {post.content}
        </p>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <button
            type="button"
            className="inline-flex items-center gap-1 hover:text-primary"
          >
            <ThumbsUp className="h-4 w-4" /> 좋아요 {post.likes}
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1 hover:text-primary"
          >
            <MessageCircle className="h-4 w-4" /> 댓글 {post.comments}
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
