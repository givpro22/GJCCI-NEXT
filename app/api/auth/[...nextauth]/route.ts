// app/api/auth/[...nextauth]/route.ts
import { handlers } from "@/auth";

// NextAuth가 제공하는 GET/POST 핸들러를 그대로 노출
export const { GET, POST } = handlers;
