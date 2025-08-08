import { Link } from 'react-router'
import { Button } from '@/components/ui/button.tsx'

export default function Header() {
  return (
    <header>
      <nav>
        <Link to="/login">로그인</Link>
        <Link to="/user/register">회원가입</Link>
        <Button>Click me</Button>
      </nav>
    </header>
  )
}
