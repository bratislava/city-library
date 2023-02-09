import ChevronRight from '@assets/images/chevron-right.svg'
import SingleDot from '@assets/images/dot.svg'
import Download from '@assets/images/download.svg'
import ExternalLink from '@assets/images/external-link.svg'
import Home from '@assets/images/home.svg'
import { FileIcon, Link, SectionContainer } from '@bratislava/ui-city-library'
import Button from '@modules/common/Button'
import FormatDate from '@modules/formatting/FormatDate'
import { BasicDocumentEntityFragment } from '@services/graphql'
import { useDownloadAriaLabel } from '@utils/useDownloadAriaLabel'
import { getFileSize } from '@utils/utils'
import truncate from 'lodash/truncate'
import { useTranslation } from 'next-i18next'
import React, { ReactNode } from 'react'

import DefaultPageLayout from '../layouts/DefaultPageLayout'

interface IProps {
  basicDocument: BasicDocumentEntityFragment
}

interface FileMetadata {
  key: string
  content: ReactNode
}

const DESCRIPTION_LIMIT = 100

const CustomPageBreadcrumbs = ({ basicDocument }: IProps) => {
  const { t } = useTranslation('common')

  return (
    <div className="mt-4.5 flex items-center gap-x-4">
      <Link variant="plain" href="/">
        <Home className="cursor-pointer" />
      </Link>
      <ChevronRight className="ml-1" />
      {/* TODO use default link styles */}
      <Link variant="default" href={t('documents_slug')} className="normal-case underline">
        {t('documents_page_name')}
      </Link>
      <ChevronRight className="ml-1" />

      <span className="text-sm">{basicDocument?.attributes?.title}</span>
    </div>
  )
}

const BasicDocumentPage = ({ basicDocument }: IProps) => {
  const { t, i18n } = useTranslation('common')
  const { getDownloadAriaLabel } = useDownloadAriaLabel()

  const [expandDescription, setExpandDescription] = React.useState(false)
  const { description, file_category, author, date_added, link, metadata, title, attachment } =
    basicDocument?.attributes ?? {}
  const { attributes } = attachment?.data ?? {}
  const { size } = attributes ?? {}

  const showExpandButton = description ? description.length > DESCRIPTION_LIMIT : false

  const fileSize = getFileSize(size, i18n.language)

  const Metadata: FileMetadata[] = [
    {
      key: `${t('type')}:`,
      // TODO: add link to filtered category
      content: file_category?.data?.attributes?.name,
    },
    { key: `${t('author')}:`, content: author },
    {
      key: `${t('createdAt')}:`,
      content: <FormatDate valueType="ISO" value={date_added} />,
    },
    {
      key: `${t('size')}:`,
      content: fileSize ?? '',
    },
    {
      key: `${t('link')}:`,
      content: link ? (
        <>
          {/* Mobile */}
          <Link
            href={link ?? '#'}
            uppercase={false}
            className="text-foreground-body underline lg:hidden"
            variant="plain"
            size="default"
          >
            {link}
          </Link>
          {/* Desktop */}
          <Link
            href={link ?? '#'}
            uppercase={false}
            className="hidden text-foreground-body underline lg:block"
            variant="plain"
            size="large"
          >
            {link}
          </Link>
        </>
      ) : null,
    },
  ]

  const transformedMetadata: Array<FileMetadata> =
    metadata && metadata[0]
      ? Object.entries(metadata[0])
          .filter(
            (entry) =>
              (entry[0] !== '__typename' && entry[0] !== 'id' && entry[0] !== 'attachment') ||
              entry[0] === 'attachment'
          )
          .map((entry) => {
            if (entry[0] !== '__typename' && entry[0] !== 'id' && entry[0] !== 'attachment') {
              return {
                key: `${t(entry[0])}:`,
                content: entry[1],
              }
            }
            return {
              key: 'Attachment',
              content: entry[1].name,
            }
          })
      : []

  const fullMetadata = Metadata?.concat(transformedMetadata)

  return (
    <DefaultPageLayout title={title}>
      <SectionContainer>
        <CustomPageBreadcrumbs basicDocument={basicDocument} />
        <div className="mt-6 flex gap-x-8 border-b border-border-dark pb-10 lg:mt-16 lg:pb-32">
          <FileIcon
            className="hidden lg:flex"
            type={attributes?.ext?.toUpperCase().replace('.', '')}
          />
          <div className="w-full">
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
              {/* Header */}
              <span className="flex h-14 w-14 items-center justify-center rounded-full border border-border-dark text-[12px] lg:hidden">
                {attributes?.ext?.toUpperCase().replace('.', '')}
              </span>
              <h1 className="mt-8 text-h1 lg:mt-0">{title}</h1>
              <div className="mt-2 items-center text-base text-foreground-body lg:flex lg:gap-x-3">
                <p className="hidden lg:block">{author}</p>
                <SingleDot className="hidden lg:block" />
                <p>
                  {t('added')} <FormatDate valueType="ISO" value={date_added} />
                </p>
              </div>
              {attachment?.data?.attributes?.url && (
                <div className="my-6 flex w-full flex-col items-center gap-y-3 lg:mb-10 lg:flex-row lg:gap-y-0 lg:gap-x-4">
                  <Button
                    href={attachment?.data?.attributes?.url}
                    target="_blank"
                    rel="noreferrer"
                    mobileFullWidth
                    aria-label={title && `${t('open')} ${title}`}
                    startIcon={<ExternalLink />}
                  >
                    {t('open')}
                  </Button>
                  <Button
                    variant="secondary"
                    mobileFullWidth
                    href={attachment?.data?.attributes?.url}
                    // TODO add download title
                    // download={file?.attributes?.attachment?.data?.attributes?.name}
                    aria-label={title && getDownloadAriaLabel(attachment.data, title)}
                    startIcon={<Download />}
                  >
                    {t('download')}
                  </Button>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-4 border-y border-border-dark py-6 lg:space-y-6 lg:py-10">
              <h3 className="text-h3">{t('description')}</h3>
              <p className="text-sm text-foreground-body lg:text-base">
                {truncate(description || undefined, {
                  length: expandDescription ? description?.length : DESCRIPTION_LIMIT,
                })}
              </p>

              {showExpandButton && (
                <Button
                  variant="plain-primary"
                  endIcon={<ChevronRight />}
                  onPress={() => setExpandDescription((prev) => !prev)}
                >
                  {expandDescription ? t('showLess') : t('showMore')}
                </Button>
              )}
            </div>

            {/* Metadata */}
            <ul className="mt-6 space-y-3 text-sm text-foreground-body lg:mt-10 lg:text-base">
              {fullMetadata
                .filter((data) => data?.content)
                .map((data, i) => (
                  <li className="flex items-center gap-x-4 lg:gap-x-6" key={i}>
                    <span className="w-24 lg:w-28">{data && data.key}</span>
                    <span>{data && data.content}</span>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </SectionContainer>
    </DefaultPageLayout>
  )
}

export default BasicDocumentPage
