import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { CategoryId, Post } from "@/lib/definitions";
import { createPost, fetchPosts } from "@/lib/supabase";
import { createPostSchema } from "../schemas/createPostSchema";
import { PAGE_SIZE } from "@/constants/constants";

export function useCommunityPage() {
  const { data: session } = useSession();

  const [selectedCategory, setSelectedCategory] = useState<CategoryId>("all");

  const [writeCategory, setWriteCategory] = useState<CategoryId>("notice");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostTitle, setNewPostTitle] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);

  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // 카테고리 바뀌면 1페이지로
  useEffect(() => {
    setPage(1);
  }, [selectedCategory]);

  // 목록 로딩
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const { posts, totalCount } = await fetchPosts({
          page,
          pageSize: PAGE_SIZE,
          category: selectedCategory,
        });
        setPosts(posts);
        setTotalCount(totalCount);
      } catch {
        toast.error("게시글을 불러오는 중 오류가 발생했어요.");
      }
    };
    loadPosts();
  }, [page, selectedCategory]);

  const handleCreatePost = async () => {
    // 먼저 payload 캡처
    const payload = {
      session,
      title: newPostTitle,
      content: newPostContent,
      category: writeCategory,
      anonymous: isAnonymous,
    };

    const parsed = createPostSchema.safeParse(payload);
    if (!parsed.success) {
      toast.info("로그인이 필요하거나 입력값이 올바르지 않습니다.");
      return;
    }

    const { user } = parsed.data.session;

    const optimisticPost: Post = {
      id: Date.now(),
      author_id: user.id,
      author_name: parsed.data.anonymous ? "익명" : user.name ?? "",
      category: payload.category,
      title: payload.title,
      content: payload.content,
      likes: 0,
      comments: 0,
      created_at: new Date().toISOString(),
    };

    setPosts((prev) => [optimisticPost, ...prev]);
    setTotalCount((prev) => prev + 1);

    // UI reset
    setNewPostContent("");
    setNewPostTitle("");
    setIsAnonymous(false);
    setWriteCategory("notice");
    setIsWriteModalOpen(false);

    try {
      await createPost({
        author_id: user.id,
        author_name: optimisticPost.author_name,
        category: payload.category,
        title: payload.title,
        content: payload.content,
        likes: 0,
        comments: 0,
      });

      setPage(1);
      toast.success("게시글이 성공적으로 작성되었어요!");
    } catch {
      setPosts((prev) => prev.filter((p) => p.id !== optimisticPost.id));
      setTotalCount((prev) => Math.max(0, prev - 1));
      toast.error(
        "게시글 작성 중 오류가 발생했어요. 잠시 후 다시 시도해주세요."
      );
    }
  };

  const handleDelete = (deletedId: Post["id"]) => {
    setPosts((prev) => prev.filter((p) => p.id !== deletedId));
    setTotalCount((prev) => Math.max(0, prev - 1));
  };

  return {
    // state
    selectedCategory,
    setSelectedCategory,
    writeCategory,
    setWriteCategory,
    newPostContent,
    setNewPostContent,
    newPostTitle,
    setNewPostTitle,
    isAnonymous,
    setIsAnonymous,
    isWriteModalOpen,
    setIsWriteModalOpen,

    posts,
    page,
    setPage,
    totalCount,

    // actions
    handleCreatePost,
    handleDelete,
  };
}
