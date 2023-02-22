import { BurgerIcon } from '@assets/icons'
import Button from '@modules/common/Button'
import { MobileNavigation } from '@modules/navigation/MobileNavigation'
import { MenuItem } from '@modules/navigation/NavMenu'
import cx from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { useEffect, useState } from 'react'

import HeaderSearchBox from '../Navigation/HeaderSearchBox'
import SkipToContentButton from '../SkipToContentButton'

const TITLE_CLASSES =
  'flex h-[30px] min-w-fit items-center border-r border-border-dark px-[7px] py-[2px]'

type MobileHeaderProps = {
  menus: MenuItem[]
}

const MobileHeader = ({ menus }: MobileHeaderProps) => {
  const [isMenuOpen, setMenuOpen] = useState(false)
  const router = useRouter()
  const { t } = useTranslation('common')
  const [isSearchOpen, setSearchOpen] = useState(false)

  // close mobile header on route change
  useEffect(() => {
    router.events.on('routeChangeStart', () => setMenuOpen(false))
    return () => router.events.off('routeChangeStart', () => setMenuOpen(false))
  }, [router])

  const pageTitle = (word: string, index: number) => (
    <span key={index} className={cx(TITLE_CLASSES)}>
      {word}
    </span>
  )

  return (
    <>
      <div className="m-auto">
        <div className="flex justify-between border-b border-border-dark">
          <Link href="/" passHref legacyBehavior>
            <>
              <a className="relative hidden w-full grid-cols-10 items-center pr-8 uppercase lg:grid">
                {t('pageTitle')
                  .split(' ')
                  .map((word, index) => (
                    <span
                      // eslint-disable-next-line react/no-array-index-key
                      key={index}
                      className={cx(TITLE_CLASSES, {
                        'col-span-1': word.length <= 4,
                        'col-span-5': word.length > 4,
                      })}
                    >
                      {word}
                    </span>
                  ))}
                <div className="absolute top-1/2 -z-10 w-full border-b border-border-dark" />
              </a>
              <Link
                href="/"
                className="flex w-full flex-col justify-center text-[22px] leading-[26px]"
              >
                <div className="relative flex w-full flex-wrap items-center pr-8 uppercase lg:hidden">
                  {t('pageTitle')
                    .split(' ')
                    .slice(0, 2)
                    .map((word, index) => pageTitle(word, index))}
                  <div className="absolute bottom-0 -z-10 w-full border-b border-border-dark" />
                </div>
                <div className="relative flex w-full flex-wrap items-center pr-8 uppercase lg:hidden">
                  {t('pageTitle')
                    .split(' ')
                    .slice(2)
                    .map((word, index) => pageTitle(word, index))}
                </div>
              </Link>
            </>
          </Link>

          <SkipToContentButton />

          {/* This div should match in size with close menu button div */}
          <div className="flex w-[61px] shrink-0 items-center justify-center border-l border-border-dark">
            <Button variant="unstyled" className="p-4" onPress={() => setMenuOpen(true)}>
              <BurgerIcon />
            </Button>
            <MobileNavigation
              isOpen={isMenuOpen}
              onClose={() => setMenuOpen(false)}
              menus={menus}
            />
          </div>
        </div>
      </div>

      <div className="m-auto border-b border-border-dark py-2 px-[5px]">
        <HeaderSearchBox isOpen={isSearchOpen} setOpen={setSearchOpen} />
      </div>
    </>
  )
}

export default MobileHeader
