import { Link } from 'react-router'
import useUserAPI from '@/hooks/useUser.ts'
import { Button } from '@/components/ui/button.tsx'
import { PenTool } from 'lucide-react'
import { ProfileDropdown } from '@/components/ProfileDropdown.tsx'
import type { GetUserResponse } from '@/type/users.ts'
import useAuthAPI from '@/hooks/useAuth.ts'

function CreateArticleButton() {
  return (
    <Button asChild>
      <Link to="/post/create">
        <PenTool className="mr-2 h-4 w-4" />
        새글 작성
      </Link>
    </Button>
  )
}

function LoginButton() {
  return (
    <Button
      variant="ghost"
      asChild>
      <Link to="/login">로그인</Link>
    </Button>
  )
}

function RegisterUserButton() {
  return (
    <Button asChild>
      <Link to="/user/register">회원가입</Link>
    </Button>
  )
}

export default function Header() {
  const { user } = useUserAPI()
  const { userLogoutMutation } = useAuthAPI()

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="text-xl font-bold text-primary">
            Blog
          </Link>

          <nav className="flex items-center space-x-4">
            {user.userId ? (
              <>
                <CreateArticleButton />
                <ProfileDropdown
                  user={user as GetUserResponse}
                  onLogout={() => userLogoutMutation.mutate()}
                />
              </>
            ) : (
              <>
                <LoginButton />
                <RegisterUserButton />
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
