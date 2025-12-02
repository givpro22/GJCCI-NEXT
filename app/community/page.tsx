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

function CommunityPage() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>("all");
  const [newPostContent, setNewPostContent] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const { data: session } = useSession();

  const handleCreatePost = async () => {
    if (!newPostContent.trim() || !newPostTitle.trim()) return;
    try {
      await createPost({
        author: isAnonymous ? "익명" : session?.user?.name || "Unknown",
        category: selectedCategory,
        title: newPostTitle,
        content: newPostContent,
        likes: 0,
        comments: 0,
      });
      const updated = await fetchPosts(selectedCategory);
      setPosts(updated);
      setNewPostContent("");
      setNewPostTitle("");
      setIsAnonymous(false);
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
        const fetchedPosts = await fetchPosts(selectedCategory);
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Failed to load posts:", error);
        toast.error(
          "게시글을 불러오는 중 오류가 발생했어요. 잠시 후 다시 시도해주세요."
        );
      }
    };

    loadPosts();
  }, [selectedCategory]);

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
            anonymous={isAnonymous}
            onToggleAnonymous={() => setIsAnonymous((v) => !v)}
            onSubmit={handleCreatePost}
          />

          <Separator />

          {/* 게시글 리스트 */}
          <section className="space-y-4">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                categoryLabel={
                  CATEGORIES.find((c) => c.id === post.category)?.label
                }
              />
            ))}

            {posts.length === 0 && (
              <div className="py-16 text-center text-sm text-muted-foreground">
                아직 이 카테고리에 글이 없어요. 첫 글의 주인공이 되어 주세요! ✨
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

export default CommunityPage;
