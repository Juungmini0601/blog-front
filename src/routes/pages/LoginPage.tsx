import { useLoginForm } from '@/hooks/form/useUserLoginForm.ts'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card.tsx'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button.tsx'
import EmailInput from '@/components/EmailInput.tsx'
import PasswordInput from '@/components/PasswordInput.tsx'

export default function LoginPage() {
  const { register, handleSubmit, errors, isLoading, onSubmit } = useLoginForm()

  return (
    <Card className="max-w-md mx-auto mt-10 shadow-lg">
      <CardHeader>
        <CardTitle>로그인</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <EmailInput
            field={register('email')}
            error={errors.email?.message}
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
