import { LoginForm, Logo } from "@/components/login/";
import { Suspense } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui";
import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-lg">
            <Logo />
          </div>
          <div className="text-center space-y-1">
            <CardTitle>로그인</CardTitle>
            <CardDescription>
              이메일과 비밀번호를 입력해 부감독 전용 커뮤니티에 접속하세요.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Suspense>
            <LoginForm />
          </Suspense>
        </CardContent>
        <CardFooter className="flex justify-center text-sm text-muted-foreground">
          아직 계정이 없다면?
          <Button variant="link" className="p-0 ml-1" asChild>
            <Link href="/signup" className="ml-1 font-medium">
              회원가입
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
