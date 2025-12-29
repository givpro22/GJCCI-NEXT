import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { z } from "zod";
import { createClient } from "./utils/supabase/server";

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "Supabase Credentials",
      async authorize(credentials) {
        const parsed = z
          .object({
            email: z.string().email(),
            password: z.string().min(6),
          })
          .safeParse(credentials);

        if (!parsed.success) {
          console.log("zod fail");
          return null;
        }

        const { email, password } = parsed.data;

        const supabase = await createClient();

        // 🔥 Supabase Auth로 실제 로그인 시도
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error || !data.user) {
          console.log("supabase auth fail", error);
          return null;
        }

        const supaUser = data.user;
        const { data: profile, error: profileError } = await supabase
          .from("users")
          .select("role, status")
          .eq("id", supaUser.id)
          .single();

        if (profileError || !profile || profile.status !== "approved") {
          return null; // 승인 안 된 유저 또는 프로필 없음
        }
        // NextAuth에 넘겨줄 user 객체
        return {
          id: supaUser.id,
          email: supaUser.email,
          name: supaUser.user_metadata.name,
          role: profile.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // authorize()가 user를 반환했을 때

      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
        token.name = user.name;
      }

      return token;
    },

    async session({ session, token }) {
      // 클라이언트에서 세션 확인할 때
      if (session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.role = token.role;
        session.user.name = token.name;
      }

      return session;
    },
  },
});
