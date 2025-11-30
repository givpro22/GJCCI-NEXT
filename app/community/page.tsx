"use client";

import { useState } from "react";
import PostCard from "@/components/community/PostCard";
import { Separator } from "@/components/ui/separator";
import { CategorySidebar } from "@/components/community/CategorySidebar";
import { CATEGORIES, CategoryId, Post } from "@/lib/definitions";
import { MOCK_POSTS } from "@/constants/data";
import { MobileCategoryTab } from "@/components/community/MobileCategoryTab";
import Composer from "@/components/community/composer";

function CommunityPage() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>("all");
  const [newPostContent, setNewPostContent] = useState("");

  const filteredPosts =
    selectedCategory === "all"
      ? MOCK_POSTS
      : MOCK_POSTS.filter((post) => post.category === selectedCategory);

  const handleCreatePost = () => {
    // 아직 실제 API 연동 전이므로 경고만 표시
    if (!newPostContent.trim()) return;
    alert("게시글 작성 기능은 이후에 연동될 예정입니다 🙂");
    setNewPostContent("");
  };

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
            onSubmit={handleCreatePost}
          />

          <Separator />

          {/* 게시글 리스트 */}
          <section className="space-y-4">
            {filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                categoryLabel={
                  CATEGORIES.find((c) => c.id === post.category)?.label
                }
              />
            ))}

            {filteredPosts.length === 0 && (
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
