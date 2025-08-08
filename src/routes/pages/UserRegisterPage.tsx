import { Button } from '@/components/ui/button.tsx'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input.tsx'
import { Label } from '@/components/ui/label.tsx'
import { useUserRegisterForm } from '@/hooks/form/useUserRegisterForm.ts'
import { Link } from 'react-router'

export default function UserRegisterPage() {
  const { register, handleSubmit, errors, isLoading, onSubmit } =
    useUserRegisterForm()

  return (
    <Card className="max-w-md mx-auto mt-10 shadow-lg">
      <CardHeader>
        <CardTitle>회원가입</CardTitle>
      </CardHeader>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate>
        <CardContent className="space-y-4">
          {/* 이메일 */}
          <div>
            <Label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2">
              이메일
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="example@email.com"
              aria-invalid={!!errors.email}
              aria-describedby="email-error"
              disabled={isLoading}
              {...register('email')}
            />
            {errors.email && (
              <p
                id="email-error"
                className="mt-1 text-red-500 text-sm">
                {errors.email.message}
              </p>
            )}
          </div>
          {/* 닉네임 */}
          <div>
            <Label
              htmlFor="nickname"
              className="block text-sm font-medium text-gray-700 mb-2">
              닉네임
            </Label>
            <Input
              id="nickname"
              type="text"
              placeholder="닉네임을 입력하세요"
              aria-invalid={!!errors.nickname}
              aria-describedby="nickname-error"
              disabled={isLoading}
              {...register('nickname')}
            />
            {errors.nickname && (
              <p
                id="nickname-error"
                className="mt-1 text-red-500 text-sm">
                {errors.nickname.message}
              </p>
            )}
          </div>
          {/* 비밀번호 */}
          <div>
            <Label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2">
              비밀번호
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              aria-invalid={!!errors.password}
              aria-describedby="password-error"
              disabled={isLoading}
              {...register('password')}
            />
            {errors.password && (
              <p
                id="password-error"
                className="mt-1 text-red-500 text-sm">
                {errors.password.message}
              </p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-between mt-8">
          <div>
            <span>이미 가입 하셨나요? </span>
            <Link to="/login">
              <span className="font-bold cursor-pointer underline">로그인</span>
            </Link>
          </div>

          <Button
            type="submit"
            className="cursor-pointer"
            disabled={isLoading}>
            {isLoading ? '가입 중...' : '회원가입'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
