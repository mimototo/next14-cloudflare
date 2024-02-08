import { db } from "@/lib/prisma";
import Link from "next/link";

export default async function Home() {
  const posts = await db.post.findMany()

  return (
    <div>
      {posts.length > 0 ? (
        <ul>
          {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
          {posts.map((post: any) => {
            return (
              <li key={post.id}>
                <Link href={`/posts/${post.id}`}>{post.title}</Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <p>
          記事はありません
        </p>
      )}
    </div>
  );
}
