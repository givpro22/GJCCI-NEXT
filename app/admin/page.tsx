import { createClient } from "@/utils/supabase/server";
import { approveUser, rejectUser, updateUserRole, deleteUser } from "./action";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default async function AdminPage() {
  const supabase = await createClient();

  const { data: users } = await supabase
    .from("users")
    .select("id, name, email, role, status");

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">사용자 관리</h1>
      <p className="text-sm text-muted-foreground">
        사용자 승인 상태 및 역할을 관리합니다.
      </p>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>이름</TableHead>
            <TableHead>이메일</TableHead>
            <TableHead>역할</TableHead>
            <TableHead>상태</TableHead>
            <TableHead className="text-right">관리</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users?.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>

              {/* 역할 변경 */}
              <TableCell>
                <form
                  action={async (formData) => {
                    "use server";
                    await updateUserRole(user.id, formData.get("role") as any);
                  }}
                  className="flex items-center gap-2"
                >
                  <Select name="role" defaultValue={user.role}>
                    <SelectTrigger className="w-[160px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">관리자</SelectItem>
                      <SelectItem value="main_director">정감독</SelectItem>
                      <SelectItem value="sub_director">부감독</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button size="sm" variant="outline">
                    변경
                  </Button>
                </form>
              </TableCell>

              {/* 상태 */}
              <TableCell>
                {user.status === "approved" && (
                  <Badge variant="default">승인됨</Badge>
                )}
                {user.status === "pending" && (
                  <Badge variant="secondary">대기중</Badge>
                )}
                {user.status === "rejected" && (
                  <Badge variant="destructive">거절됨</Badge>
                )}
              </TableCell>

              {/* 승인 / 거절 */}
              <TableCell className="text-right space-x-2">
                {user.status === "pending" && (
                  <>
                    <form
                      action={approveUser.bind(null, user.id)}
                      className="inline"
                    >
                      <Button size="sm" variant="default">
                        승인
                      </Button>
                    </form>
                    <form
                      action={rejectUser.bind(null, user.id)}
                      className="inline"
                    >
                      <Button size="sm" variant="destructive">
                        거절
                      </Button>
                    </form>
                  </>
                )}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="ghost">
                      삭제
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>사용자 삭제</AlertDialogTitle>
                      <AlertDialogDescription>
                        이 사용자를 삭제하면 복구할 수 없습니다. 정말
                        삭제하시겠습니까?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>취소</AlertDialogCancel>
                      <form action={deleteUser.bind(null, user.id)}>
                        <AlertDialogAction type="submit">
                          삭제
                        </AlertDialogAction>
                      </form>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
