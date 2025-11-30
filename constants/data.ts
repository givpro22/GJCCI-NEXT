import { Post } from "@/lib/definitions";

export const MOCK_POSTS: Post[] = [
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
