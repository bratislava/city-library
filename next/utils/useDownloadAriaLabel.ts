import { UploadFileEntityFragment } from '@services/graphql'
import { useTranslation } from 'next-i18next'
import { useCallback } from 'react'

import { getFileSize } from './utils'

export const useDownloadAriaLabel = () => {
  const { t, i18n } = useTranslation('common')

  // borrowed from project https://github.com/bratislava/marianum
  const getDownloadAriaLabel = useCallback(
    (file: UploadFileEntityFragment): string => {
      if (!file.attributes) {
        return t('openFile')
      }
      const { size, ext, name } = file.attributes
      const formattedSize = getFileSize(size, i18n.language)
      const extFormatted = ext?.replace('.', '') ?? t('unknownFormat')

      return t('openFileAriaLabel', {
        title: name,
        ext: extFormatted,
        size: formattedSize,
      })
    },
    [i18n.language, t]
  )
  return { getDownloadAriaLabel }
}
