import cx from 'classnames'

import Calendar from '@/assets/images/calendar.svg'

export interface BannerProps {
  className?: string
  onBannerClick: () => void
  title?: string
  description?: string
  buttonContent?: string
}

export const Banner = ({
  className,
  onBannerClick,
  title,
  description,
  buttonContent,
}: BannerProps) => {
  return (
    <div
      className={cx(
        'flex flex-col items-center justify-between gap-y-6 bg-dark p-4 text-center lg:flex-row lg:gap-y-0 lg:p-10 lg:text-left',
        className
      )}
    >
      <div className="max-w-[288px] lg:max-w-[754px]">
        <h4 className="text-h4 text-white">{title}</h4>
        <p className="pt-3 text-sm text-[#B0B0B0] lg:text-base">{description}</p>
      </div>
      {/* TODO replace by Button */}
      <button
        onClick={onBannerClick}
        className="hover:bg-gray-100 flex items-center gap-x-[11px] bg-white py-[9px] px-5 text-sm"
      >
        <Calendar />
        <p>{buttonContent}</p>
      </button>
    </div>
  )
}
