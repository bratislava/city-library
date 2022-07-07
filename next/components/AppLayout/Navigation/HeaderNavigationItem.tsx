import cx from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'

export interface INavigationItemProps {
  url: string
  children: ReactNode
}

function HeaderNavigationItem({ url, children }: INavigationItemProps) {
  const router = useRouter()

  return (
    <div className="border-gray-900 py-[10px] text-xs font-normal leading-[19.6px] md:flex">
      <div
        className={cx('font-normal', {
          'text-primary': router.pathname.startsWith(url),
        })}
      >
        <Link href={url} passHref>
          <a href={url}>{children}</a>
        </Link>
      </div>
    </div>
  )
}

export default HeaderNavigationItem
