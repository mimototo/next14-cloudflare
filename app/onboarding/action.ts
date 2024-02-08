import { z } from "zod";
import { authGuard } from "../actions/auth";
import { db } from "@/lib/prisma";

const UserSchema = z.object({
  name: z.string().max(240),
});

export const createUser = async (validateData: FormData) => {
  'use server'

  const id = authGuard();
  const validateData = UserSchema.parse({
    name: fromData.get('name')
  })

  const data: Prisma.UserUncheckedCreateInput = {
    name: validateData.name,
    id
  }

  // DBにユーザーを作成
  await db.user.create({
    data
  })

  // Clerkのユーザーメタデータにオンボーディング完了ステータスをセット
  await clerkClient.users.updateUserMetadata(id, {
    publicMetadata: {
      onboarded: true,
    },
  });

  // キャッシュをクリア
  revalidatePath('/');

  // トップページへリダイレクト
  redirect('/');
}
