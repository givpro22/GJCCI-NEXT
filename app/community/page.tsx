"use client";

import PostCard from "@/components/community/PostCard";
import { Separator } from "@/components/ui/separator";
import { CategorySidebar } from "@/components/community/CategorySidebar";
import { CATEGORIES } from "@/lib/definitions";
import { MobileCategoryTab } from "@/components/community/MobileCategoryTab";
import Composer from "@/components/community/composer";
import { Button } from "@/components/ui/button";
import { useCommunityPage } from "@/components/community/hook/useCommunityPage";
import { PAGE_SIZE } from "@/constants/constants";

export default function CommunityPage() {
  const c = useCommunityPage();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-muted/30">
      <div className="mx-auto flex max-w-6xl gap-6 px-4 py-8 lg:px-0">
        <CategorySidebar
          categories={CATEGORIES}
          selectedCategory={c.selectedCategory}
          onSelect={c.setSelectedCategory}
        />

        <main className="flex-1 space-y-6">
          <MobileCategoryTab
            categories={CATEGORIES}
            selectedCategory={c.selectedCategory}
            onSelect={c.setSelectedCategory}
          />

          <Composer
            value={c.newPostContent}
            onChange={c.setNewPostContent}
            title={c.newPostTitle}
            onTitleChange={c.setNewPostTitle}
            category={c.writeCategory}
            onCategoryChange={c.setWriteCategory}
            anonymous={c.isAnonymous}
            onToggleAnonymous={() => c.setIsAnonymous((v) => !v)}
            onSubmit={c.handleCreatePost}
            open={c.isWriteModalOpen}
            onOpenChange={c.setIsWriteModalOpen}
          />

          <Separator />

          <section className="space-y-4">
            {c.posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                categoryLabel={
                  CATEGORIES.find((x) => x.id === post.category)?.label
                }
                onDelete={c.handleDelete}
              />
            ))}

            {c.posts.length === 0 && (
              <div className="py-16 text-center text-sm text-muted-foreground">
                아직 이 카테고리에 글이 없어요. 첫 글의 주인공이 되어 주세요!
              </div>
            )}
          </section>

          {c.totalCount > PAGE_SIZE && (
            <div className="flex justify-center gap-2 pt-6">
              <Button
                variant="outline"
                size="sm"
                disabled={c.page === 1}
                onClick={() => c.setPage((p) => p - 1)}
              >
                이전
              </Button>

              <span className="text-sm flex items-center">
                {c.page} / {Math.ceil(c.totalCount / PAGE_SIZE)}
              </span>

              <Button
                variant="outline"
                size="sm"
                disabled={c.page === Math.ceil(c.totalCount / PAGE_SIZE)}
                onClick={() => c.setPage((p) => p + 1)}
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
