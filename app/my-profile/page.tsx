"use client";

import { useEffect, useState, useTransition } from "react";
import { getMyProfile, updateMyProfile } from "./actions";
import type { User } from "@supabase/supabase-js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export default function MyProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const { update } = useSession();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { user, role } = await getMyProfile();
        setUser(user);
        setName(user.user_metadata?.name ?? "");
        setRole(role);
      } catch (err) {
        console.error("프로필 조회 실패", err);
      }
    };
    fetchProfile();
  }, []);

  if (!user) return null;

  const handleSave = () => {
    startTransition(async () => {
      try {
        await updateMyProfile({ name });
        setIsEditing(false);
        await update();
      } catch (error) {
        toast.error("프로필 업데이트에 실패했습니다.");
      }
    });
  };

  return (
    <div className="flex justify-center py-10 px-4">
      <Card className="w-full max-w-xl">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback>{name.slice(0, 2)}</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <CardTitle className="text-xl">{name}</CardTitle>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>

          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} variant="outline">
              프로필 수정
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={isPending}>
                저장
              </Button>
              <Button variant="ghost" onClick={() => setIsEditing(false)}>
                취소
              </Button>
            </div>
          )}
        </CardHeader>

        <Separator />

        <CardContent className="space-y-6 mt-6">
          <div>
            <Label>이름</Label>
            <Input
              value={name}
              disabled={!isEditing}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <Label>이메일</Label>
            <Input value={user.email} disabled />
          </div>

          <div>
            <Label>권한</Label>
            <Input value={role} disabled />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
