import siteMetadata from '@/data/siteMetadata'
import defaultNavLinks from '@/data/headerNavLinks'
import Logo from '@/data/logo.svg'
import Link from './Link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import SearchButton from './SearchButton'
import { NavLinkItem } from '@/lib/portfolio-types'

interface HeaderProps {
  headerTitle?: string
  navLinks?: NavLinkItem[]
}

const Header = ({ headerTitle, navLinks }: HeaderProps) => {
  const titleText = headerTitle || siteMetadata.headerTitle
  const linksToRender = (navLinks || defaultNavLinks.map((l) => ({ ...l, visible: true }))).filter(
    (l) => l.visible !== false
  )

  let headerClass = 'flex items-center w-full bg-white dark:bg-gray-950 justify-between py-10'
  if (siteMetadata.stickyNav) {
    headerClass += ' sticky top-0 z-50'
  }

  return (
    <header className={headerClass}>
      <Link href="/" aria-label={titleText}>
        <div className="flex items-center justify-between">
          <div className="mr-3">
            <Logo />
          </div>
          <div className="hidden h-6 text-2xl font-semibold whitespace-nowrap sm:block">
            {titleText}
          </div>
        </div>
      </Link>
      <div className="flex items-center space-x-4 leading-5 sm:-mr-6 sm:space-x-6">
        <div className="no-scrollbar hidden max-w-40 items-center gap-x-4 overflow-x-auto sm:flex md:max-w-72 lg:max-w-96">
          {linksToRender
            .filter((link) => link.href !== '/')
            .map((link) => (
              <Link
                key={`${link.title}-${link.href}`}
                href={link.href}
                className="hover:text-primary-500 dark:hover:text-primary-400 m-1 font-medium whitespace-nowrap text-gray-900 dark:text-gray-100"
              >
                {link.title}
              </Link>
            ))}
        </div>
        <SearchButton />
        <ThemeSwitch />
        <MobileNav navLinks={linksToRender} />
      </div>
    </header>
  )
}

export default Header
