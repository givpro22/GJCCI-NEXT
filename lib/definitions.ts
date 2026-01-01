export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type Post = {
  id: number;
  avatar?: string; // 임시로
  author_id: string;
  author_name: string;
  category: CategoryId;
  title: string;
  content: string;
  likes: number;
  comments: number;
  created_at: string;
};

export const CATEGORIES = [
  { id: "all", label: "전체" },
  { id: "notice", label: "공지" },
  { id: "free", label: "자유" },
  { id: "error", label: "오류" },
];

export type CategoryId = (typeof CATEGORIES)[number]["id"];
