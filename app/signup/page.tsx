import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { SignUpForm } from "@/components/signup";
import { Button } from "@/components/ui";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export default function SignUpPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>회원가입</CardTitle>
          <CardDescription>
            이메일과 비밀번호를 입력해 계정을 만들어보세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignUpForm />
        </CardContent>
        <CardFooter className="flex justify-center text-sm text-muted-foreground">
          이미 계정이 있다면?
          <Button variant="link" className="p-0 ml-1" asChild>
            <Link href={ROUTES.LOGIN} className="ml-1 font-medium">
              로그인
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
