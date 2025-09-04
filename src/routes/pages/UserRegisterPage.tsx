import { Button } from '@/components/ui/button.tsx'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { useUserRegisterForm } from '@/hooks/form/useUserRegisterForm.ts'
import { Link } from 'react-router'
import EmailInput from '@/components/settings/EmailInput.tsx'
import NicknameInput from '@/components/settings/NicknameInput.tsx'
import PasswordInput from '@/components/settings/PasswordInput.tsx'

export default function UserRegisterPage() {
  const { register, handleSubmit, errors, isLoading, onSubmit } =
    useUserRegisterForm()

  return (
    <Card className="max-w-md mx-auto mt-10 shadow-lg">
      <CardHeader>
        <CardTitle className="text-primary font-bold">회원가입</CardTitle>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <EmailInput
            field={register('email')}
            error={errors.email?.message}
            isLoading={isLoading}
          />

          <NicknameInput
            field={register('nickname')}
            error={errors.nickname?.message}
            isLoading={isLoading}
          />

          <PasswordInput
            field={register('password')}
            error={errors.password?.message}
            isLoading={isLoading}
          />
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
