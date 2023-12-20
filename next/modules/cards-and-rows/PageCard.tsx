import { ArrowRightIcon } from '@assets/icons'
import MLink from '@modules/common/MLink'
import ShowMoreLink from '@modules/common/ShowMoreLink'
import cx from 'classnames'
import React from 'react'

type PageCardProps = {
  className?: string
  title: string
  href: string
  showMoreText?: string
}

const PageCard = ({ className, title, href, showMoreText }: PageCardProps) => {
  return (
    <div className="group/showMore relative border border-border-dark focus-within:border-solid focus-within:ring-2 focus-within:ring-outline">
      <div className={cx('relative flex flex-col space-y-4 p-4', className)}>
        <div className="h-full overflow-hidden text-[20px]">
          <MLink href={href} variant="basic" stretched className="outline-none">
            {title}
          </MLink>
        </div>
        {showMoreText && (
          <ShowMoreLink href={href} tabIndex={-1} parentGroup>
            {showMoreText}
          </ShowMoreLink>
        )}
        {!showMoreText && (
          <div className="ml-0.5 mr-1 mt-[-3px] group-hover/showMore:ml-1.5 group-hover/showMore:mr-0">
            {/* TODO: Proper icon resizing. */}
            <ArrowRightIcon className="m-[-3px] scale-[0.75] md:m-[-2px] md:scale-[0.833333333]" />
          </div>
        )}
      </div>
    </div>
  )
}

export default PageCard
