import MLink from '@modules/common/MLink'
import cx from 'classnames'

import { Link } from '../Link/Link'
import { RowFile, RowFileProps } from '../RowFile/RowFile'

export interface DocumentsProps {
  className?: string
  title?: string
  moreLink?: { title?: string; url?: string }
  files?: { url?: string; content?: RowFileProps }[]
}

export const Documents = ({ className, title, moreLink, files }: DocumentsProps) => {
  return (
    <div className={cx(className, 'flex flex-col')}>
      <h3 className="text-h3">{title}</h3>

      <div className={cx('flex flex-col', { 'mt-6': !!title })}>
        {files?.map((file, index) => (
          <MLink key={index} href={file.url ?? ''}>
            <RowFile
              className="cursor-pointer"
              type={file.content?.type ?? ''}
              title={file.content?.title ?? ''}
              metadata={file.content?.metadata}
              dateAdded={file.content?.dateAdded || ''}
              fileType={file.content?.fileType}
            />
          </MLink>
        ))}
      </div>

      {moreLink?.url && (
        <Link className="mt-6" href={moreLink?.url ?? ''} hasIcon>
          {moreLink?.title}
        </Link>
      )}
    </div>
  )
}
