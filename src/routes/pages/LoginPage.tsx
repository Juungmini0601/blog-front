import { useLoginForm } from '@/hooks/form/useUserLoginForm.ts'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card.tsx'
import { Label } from '@/components/ui/label.tsx'
import { Input } from '@/components/ui/input.tsx'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button.tsx'

export default function LoginPage() {
  const { register, handleSubmit, errors, isLoading, onSubmit } = useLoginForm()

  return (
    <Card className="max-w-md mx-auto mt-10 shadow-lg">
      <CardHeader>
        <CardTitle>로그인</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
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
            <span>처음이신가요? </span>
            <Link to="/user/register">
              <span className="font-bold cursor-pointer underline">
                회원가입
              </span>
            </Link>
          </div>

          <Button
            type="submit"
            className="cursor-pointer"
            disabled={isLoading}>
            {isLoading ? '가입 중...' : '로그인'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
