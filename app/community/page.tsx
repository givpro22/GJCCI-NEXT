"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const CATEGORIES = [
  { id: "all", label: "전체" },
  { id: "notice", label: "공지" },
  { id: "free", label: "자유" },
  { id: "error", label: "오류" },
];

type CategoryId = (typeof CATEGORIES)[number]["id"];

type Post = {
  id: number;
  author: string;
  avatar?: string;
  category: CategoryId;
  title: string;
  content: string;
  createdAt: string;
  likes: number;
  comments: number;
};

const MOCK_POSTS: Post[] = [
  {
    id: 1,
    author: "관리자",
    category: "notice",
    title: "[공지] 커뮤니티 이용 안내",
    content:
      "GJCCI 수험생 커뮤니티에 오신 것을 환영합니다. 서로 존중하며 건설적인 정보 공유를 해주세요.",
    createdAt: "5분 전",
    likes: 12,
    comments: 3,
  },
  {
    id: 2,
    author: "홍길동",
    category: "exam-info",
    title: "이번 시험 일정 정리해봤어요",
    content:
      "2025년 시험 일정표를 한눈에 보기 쉽게 정리해봤습니다. 혹시 빠진 부분 있으면 댓글로 알려주세요!",
    createdAt: "1시간 전",
    likes: 34,
    comments: 10,
  },
  {
    id: 3,
    author: "김수민",
    category: "study",
    title: "서울/온라인 스터디 모집합니다",
    content:
      "주 2회 저녁 9시에 온라인 모의고사 풀이 스터디 하실 분 구합니다. 초보자도 환영이에요!",
    createdAt: "3시간 전",
    likes: 21,
    comments: 7,
  },
  {
    id: 4,
    author: "이준호",
    category: "free",
    title: "오늘 시험 망한 사람...",
    content:
      "나만 그런 거 아니라고 말해줘... 다들 시험 보고 나서 어떻게 멘탈 관리하세요?",
    createdAt: "어제",
    likes: 18,
    comments: 15,
  },
  {
    id: 5,
    author: "박지현",
    category: "qna",
    title: "이 과목 교재 어떤가요?",
    content:
      "○○○ 강사님 교재 써보신 분 계신가요? 장단점이 궁금합니다. 기출 위주인지 이론 비중이 큰지도 궁금해요.",
    createdAt: "어제",
    likes: 9,
    comments: 4,
  },
];

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
        <aside className="hidden w-60 shrink-0 lg:block">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">카테고리</CardTitle>
              <CardDescription>
                보고 싶은 게시판을 선택해 보세요.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-1">
              {CATEGORIES.map((category) => (
                <Button
                  key={category.id}
                  variant={
                    selectedCategory === category.id ? "default" : "ghost"
                  }
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.label}
                </Button>
              ))}
            </CardContent>
          </Card>
        </aside>

        {/* 중앙 영역 */}
        <main className="flex-1 space-y-6">
          {/* 상단 탭 (모바일/태블릿용 카테고리 선택) */}
          <div className="lg:hidden">
            <div className="mb-3 text-sm font-semibold">카테고리</div>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((category) => (
                <Button
                  key={category.id}
                  size="sm"
                  variant={
                    selectedCategory === category.id ? "default" : "outline"
                  }
                  className="rounded-full"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </div>

          {/* 글 작성 영역 (페이스북 작성 박스 느낌) */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-3 space-y-0">
              <Avatar className="h-10 w-10">
                <AvatarImage src="" alt="me" />
                <AvatarFallback>ME</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-base">
                  편하게 글을 남겨주세요
                </CardTitle>
                <CardDescription>
                  업무 관련 정보 공유, 질문, 소통 모두 환영합니다.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                placeholder="커뮤니티에 공유할 내용을 입력해 주세요."
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className="min-h-[90px] resize-none"
              />
              <div className="flex items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="outline">텍스트</Badge>
                  <span>
                    나중에 이미지/파일 업로드 기능을 추가할 수 있어요.
                  </span>
                </div>
                <Button size="sm" onClick={handleCreatePost}>
                  게시하기
                </Button>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* 게시글 리스트 */}
          <section className="space-y-4">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="border-border/70">
                <CardHeader className="flex flex-row items-start gap-3 space-y-0">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={post.avatar ?? ""} alt={post.author} />
                    <AvatarFallback>
                      {post.author.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-sm font-semibold">
                        {post.author}
                      </CardTitle>
                      <Badge variant="secondary" className="text-[10px]">
                        {CATEGORIES.find((c) => c.id === post.category)?.label}
                      </Badge>
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
                      👍 좋아요 {post.likes}
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 hover:text-primary"
                    >
                      💬 댓글 {post.comments}
                    </button>
                  </div>
                </CardContent>
              </Card>
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
