export default function Home() {
  return (
    <>
      <div>demo</div>
      <a
        href={process.env.NEXT_PUBLIC_CLERK_USER_PROFILE as string}
      // target="_blank"
      >
        アカウント設定
      </a>
    </>
  );
}
