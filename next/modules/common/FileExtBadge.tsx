import { twMerge } from 'tailwind-merge'

type FileExtBadgeProps = {
  fileExt: string
  className?: string
}

const FileExtBadge = ({ fileExt, className }: FileExtBadgeProps) => {
  return (
    <div
      aria-hidden
      className={twMerge(
        'flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-border-dark text-center text-xs text-foreground-heading',
        className
      )}
    >
      <span>{fileExt}</span>
    </div>
  )
}

export default FileExtBadge
