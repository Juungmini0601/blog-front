import { BookOpen, FileText, LogOut, Settings, User } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import { Link } from 'react-router'
import type { GetUserResponse } from '@/type/users.ts'

interface ProfileDropdownProps {
  user: GetUserResponse
  onLogout: () => void
}

export function ProfileDropdown({ user, onLogout }: ProfileDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 p-0 rounded-full cursor-pointer"
          aria-label="프로필 메뉴 열기">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={user.profileImageUrl || ''}
              alt={`${user.nickname}의 프로필`}
              className="object-cover"
            />
            <AvatarFallback>
              <User className="h-5 w-5 text-gray-500" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-56"
        align="end"
        forceMount>
        <DropdownMenuItem asChild>
          <Link
            to={`/blog/${user.userId}/posts`}
            className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>내 블로그</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link
            to="/drafts"
            className="cursor-pointer">
            <FileText className="mr-2 h-4 w-4" />
            <span>임시 글</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link
            to="/post/lists/read"
            className="cursor-pointer">
            <BookOpen className="mr-2 h-4 w-4" />
            <span>읽기 목록</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link
            to="/settings"
            className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>설정</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="cursor-pointer text-red-600 focus:text-red-600"
          onClick={onLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>로그아웃</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
