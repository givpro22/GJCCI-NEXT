"use client";

import { useEffect, useState } from "react";
import PostCard from "@/components/community/PostCard";
import { Separator } from "@/components/ui/separator";
import { CategorySidebar } from "@/components/community/CategorySidebar";
import { CATEGORIES, CategoryId, Post } from "@/lib/definitions";
import { MobileCategoryTab } from "@/components/community/MobileCategoryTab";
import Composer from "@/components/community/composer";
import { createPost, fetchPosts } from "@/lib/supabase";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { z } from "zod";

function CommunityPage() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>("all");
  const [writeCategory, setWriteCategory] = useState<CategoryId>("notice");
  const [newPostContent, setNewPostContent] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const { data: session } = useSession();

  const [page, setPage] = useState(1);
  const PAGE_SIZE = 5;

  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);

  const createPostSchema = z.object({
    session: z.object({
      user: z.object({
        id: z.string(),
        name: z.string().optional(),
      }),
    }),
    title: z.string().min(1),
    content: z.string().min(1),
    category: z.string(),
    anonymous: z.boolean(),
  });

  const handleCreatePost = async () => {
    const parsed = createPostSchema.safeParse({
      session,
      title: newPostTitle,
      content: newPostContent,
      category: writeCategory,
      anonymous: isAnonymous,
    });

    if (!parsed.success) {
      toast.info("로그인이 필요하거나 입력값이 올바르지 않습니다.");
      return;
    }

    const { user } = parsed.data.session;

    try {
      await createPost({
        author_id: user.id,
        author_name: parsed.data.anonymous ? "익명" : user.name,
        category: writeCategory,
        title: newPostTitle,
        content: newPostContent,
        likes: 0,
        comments: 0,
      });

      const updated =
        selectedCategory === "all"
          ? await fetchPosts()
          : await fetchPosts(selectedCategory);

      setPosts(updated);
      setNewPostContent("");
      setNewPostTitle("");
      setIsAnonymous(false);
      setWriteCategory("notice");
      setIsWriteModalOpen(false);

      toast.success("게시글이 성공적으로 작성되었어요!");
    } catch (error) {
      console.error("Failed to create post:", error);
      toast.error(
        "게시글 작성 중 오류가 발생했어요. 잠시 후 다시 시도해주세요."
      );
    }
  };

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const fetchedPosts =
          selectedCategory === "all"
            ? await fetchPosts()
            : await fetchPosts(selectedCategory);
        setPosts(fetchedPosts);
      } catch (error) {
        toast.error(
          "게시글을 불러오는 중 오류가 발생했어요. 잠시 후 다시 시도해주세요."
        );
      }
    };

    loadPosts();
  }, [selectedCategory]);

  useEffect(() => {
    setPage(1);
  }, [selectedCategory]);

  const paginatedPosts = posts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-muted/30">
      <div className="mx-auto flex max-w-6xl gap-6 px-4 py-8 lg:px-0">
        {/* 좌측 사이드바 - 카테고리 */}
        <CategorySidebar
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onSelect={setSelectedCategory}
        />

        {/* 중앙 영역 */}
        <main className="flex-1 space-y-6">
          {/* 상단 탭 (모바일/태블릿용 카테고리 선택) */}
          <MobileCategoryTab
            categories={CATEGORIES}
            selectedCategory={selectedCategory}
            onSelect={setSelectedCategory}
          />

          {/* 글 작성 영역*/}
          <Composer
            value={newPostContent}
            onChange={setNewPostContent}
            title={newPostTitle}
            onTitleChange={setNewPostTitle}
            category={writeCategory}
            onCategoryChange={setWriteCategory}
            anonymous={isAnonymous}
            onToggleAnonymous={() => setIsAnonymous((v) => !v)}
            onSubmit={handleCreatePost}
            open={isWriteModalOpen}
            onOpenChange={setIsWriteModalOpen}
          />

          <Separator />

          {/* 게시글 리스트 */}
          <section className="space-y-4">
            {paginatedPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                categoryLabel={
                  CATEGORIES.find((c) => c.id === post.category)?.label
                }
                onDelete={(deletedId) =>
                  setPosts((prev) => prev.filter((p) => p.id !== deletedId))
                }
              />
            ))}

            {posts.length === 0 && (
              <div className="py-16 text-center text-sm text-muted-foreground">
                아직 이 카테고리에 글이 없어요. 첫 글의 주인공이 되어 주세요! ✨
              </div>
            )}
          </section>

          {posts.length > PAGE_SIZE && (
            <div className="flex justify-center gap-2 pt-6">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                이전
              </Button>

              <span className="text-sm flex items-center">
                {page} / {Math.ceil(posts.length / PAGE_SIZE)}
              </span>

              <Button
                variant="outline"
                size="sm"
                disabled={page === Math.ceil(posts.length / PAGE_SIZE)}
                onClick={() => setPage((p) => p + 1)}
              >
                다음
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default CommunityPage;
