import MLink from '@modules/common/MLink'
import { useTranslation } from 'next-i18next'

import { useGeneralContext } from '@utils/generalContext'
import { useNavikronos } from '@utils/navikronos'
import { useGetOtherLocale } from '@utils/useGetOtherLocale'

const HeaderNavigation = () => {
  const { t } = useTranslation('common')
  const { general } = useGeneralContext()
  const { getPathForEntity } = useNavikronos()
  const otherLocale = useGetOtherLocale()

  return (
    <div className="flex flex-wrap text-sm">
      <MLink
        href={
          getPathForEntity({
            type: 'page',
            id: general?.data?.attributes?.openingHoursPage?.data?.id,
          }) ?? ''
        }
        variant="basic"
        className="relative grid place-content-center border-l border-border-dark px-3"
      >
        {t('openingHours')}
      </MLink>
      <MLink
        href="https://opac.mestskakniznica.sk/opac"
        variant="basic"
        target="_blank"
        className="grid place-content-center border-l border-border-dark px-3"
      >
        {t('onlineCatalog')}
      </MLink>
      <MLink
        href={otherLocale.path}
        locale={otherLocale.locale}
        aria-label={t('otherLocaleAriaLabel')}
        variant="basic"
        className="grid place-content-center border-l border-border-dark pl-3"
      >
        {otherLocale.locale.toUpperCase()}
      </MLink>
    </div>
  )
}

export default HeaderNavigation
