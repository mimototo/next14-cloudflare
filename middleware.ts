"use server"

import { authMiddleware, clerkClient } from "@clerk/nextjs";
import { redirectToSignIn } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default authMiddleware({
  publicRoutes: ["/"],
  async afterAuth(auth, req) {
    if (!auth.userId && auth.isPublicRoute) {
      return;
    }

    // 未ログインかつ非公開ルートへのアクセスはログイン画面へリダイレクト
    if (!auth.userId && !auth.isPublicRoute) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }

    // セッションにオンボーディングの完了ステータスがあるか確認
    let onboarded = auth.sessionClaims?.onboarded;

    if (!onboarded) {
      // セッションになければClerkユーザー情報からステータスを取得
      const user = await clerkClient.users.getUser(auth.userId!);
      onboarded = user.publicMetadata.onboarded;
    }

    // オンボーディング前ならオンボーディングページへリダイレクト
    if (!onboarded && req.nextUrl.pathname !== "/onboarding") {
      const orgSelection = new URL("/onboarding", req.url);
      return NextResponse.redirect(orgSelection);
    }

    // オンボーディング済みでオンボーディングページへアクセスしたらトップページへリダイレクト
    if (onboarded && req.nextUrl.pathname === "/onboarding") {
      const orgSelection = new URL("/", req.url);
      return NextResponse.redirect(orgSelection);
    }
  }
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
