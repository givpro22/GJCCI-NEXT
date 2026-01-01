"use client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";

dayjs.extend(relativeTime);
dayjs.locale("ko");
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, MessageCircle, Trash2 } from "lucide-react";
import { Post } from "@/lib/definitions";
import { useSession } from "next-auth/react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deletePost } from "@/lib/supabase";
import { toast } from "sonner";

export default function PostCard({
  post,
  categoryLabel,
  onDelete,
}: {
  post: Post;
  categoryLabel?: string;
  onDelete?: (postId: number) => void;
}) {
  const { data: session } = useSession();
  const isAuthor = session?.user?.id === post.author_id;
  const handleDelete = async () => {
    try {
      await deletePost(post.id);
      toast.success("게시글이 성공적으로 삭제되었어요.");
      onDelete?.(post.id);
    } catch (error) {
      toast.error(
        "게시글 삭제 중 오류가 발생했어요. 잠시 후 다시 시도해주세요."
      );
    }
  };
  return (
    <Card className="border-border/70">
      <CardHeader className="flex flex-row items-start gap-3 space-y-0">
        <Avatar className="h-9 w-9">
          <AvatarImage src={post.avatar ?? ""} alt={post.author_name} />
          <AvatarFallback>
            {post.author_name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm font-semibold">
              {post.author_name}
            </CardTitle>
            {categoryLabel && (
              <Badge variant="secondary" className="text-[10px]">
                {categoryLabel}
              </Badge>
            )}
          </div>
          <CardDescription className="text-xs">
            {dayjs(post.created_at).fromNow()}{" "}
          </CardDescription>
          <div className="mt-1 text-sm font-medium">{post.title}</div>
        </div>
        {isAuthor && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                aria-label="Delete post"
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>게시글을 삭제할까요?</AlertDialogTitle>
                <AlertDialogDescription>
                  삭제한 게시글은 복구할 수 없습니다.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  삭제
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm leading-relaxed text-muted-foreground">
          {post.content}
        </p>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          {/* <button
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
          </button> */}
        </div>
      </CardContent>
    </Card>
  );
}
