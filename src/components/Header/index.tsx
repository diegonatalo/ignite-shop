import logoImg from '@/src/assets/logo.svg'
import { Cart } from '@/src/components/Cart'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { HeaderContainer } from './styles'

export function Header() {
  const { pathname } = useRouter()

  const showCartButton = pathname !== '/success'

  return (
    <HeaderContainer>
      <Link href="/">
        <Image src={logoImg} alt="" />
      </Link>
      {showCartButton && <Cart />}
    </HeaderContainer>
  )
}
