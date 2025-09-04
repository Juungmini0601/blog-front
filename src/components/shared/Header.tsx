import { Link, useLocation, useNavigate, useSearchParams } from 'react-router'
import useUserAPI from '@/hooks/useUser.ts'
import { Button } from '@/components/ui/button.tsx'
import { Input } from '@/components/ui/input.tsx'
import { PenTool } from 'lucide-react'
import { ProfileDropdown } from '@/components/shared/ProfileDropdown.tsx'
import type { GetUserResponse } from '@/type/users.ts'
import useAuthAPI from '@/hooks/useAuth.ts'
import { useState } from 'react'

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
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const [keyword, setKeyword] = useState<string>(
    searchParams.get('keyword') ?? ''
  )
  const showSearch = location.pathname === '/'

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const q = keyword.trim()
    if (q) {
      navigate(`/search?keyword=${encodeURIComponent(q)}`)
    }
  }

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <Link
            to="/"
            className="text-xl font-bold text-primary">
            Logly
          </Link>

          {showSearch && (
            <form
              onSubmit={handleSubmit}
              className="hidden md:flex items-center gap-2 max-w-md flex-1">
              <Input
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                placeholder="검색어를 입력하세요"
                className="w-full"
              />
              <Button
                type="submit"
                className="cursor-pointer">
                검색
              </Button>
            </form>
          )}

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

        {showSearch && (
          <form
            onSubmit={handleSubmit}
            className="mt-3 md:hidden flex items-center gap-2">
            <Input
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              placeholder="검색어를 입력하세요"
              className="w-full"
            />
            <Button
              type="submit"
              size="sm">
              검색
            </Button>
          </form>
        )}
      </div>
    </header>
  )
}
