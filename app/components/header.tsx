import { Button } from "@/components/ui/button"
import { SignInButton, SignUpButton, SignedIn, SignedOut } from "@clerk/clerk-react"
import { UserButton } from "@clerk/nextjs"
import Link from "next/link"

export default function Header() {
  return (
    <header className="flex gap-2 items-center h-14 px-6">
      <Link href="/" className="font-black text-xl">
        {/* {AppConfig.title} */}
      </Link>
      <span className="flex-1"></span>
      {/* {user && ( */}
      <Button size="sm" asChild>
        <Link href="/create">ポストする</Link>
      </Button>
      {/* )} */}
      <SignedIn>
        {/* <UserMenu /> */}
      </SignedIn>

      <SignedOut>
        <SignInButton>
          <Button variant="outline">ログイン</Button>
        </SignInButton>
        <SignUpButton>
          <Button>会員登録</Button>
        </SignUpButton>
      </SignedOut>
    </header>
  )
}
