import { SectionContainer } from '@components/ui'
import { useNavikronos } from '@utils/navikronos'
import { ILocality } from '@utils/types'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import React from 'react'

import Map from '../../assets/images/mapa.png'

interface LocalitiesProps {
  localities: ILocality[]
}

// TODO: Check usage
const Localities = ({ localities }: LocalitiesProps) => {
  const { t } = useTranslation(['homepage', 'common'])
  const { getPathForEntity } = useNavikronos()

  return (
    <SectionContainer>
      <h2 className="py-10 text-h3">{t('localitiesTitle')}</h2>

      <section className="border border-border-dark pb-10">
        <img src={Map.src} alt="Mapa lokalit" height={Map.height} width={Map.width} />
        <div className="inline-flex h-[376px]">
          {localities &&
            localities?.map((locality) => (
              <div key={locality.localityTitle}>
                <div className="h-[376px] w-[294.6px] border-r border-border-dark p-6">
                  <div className="pb-7 text-h3 hover:underline">{locality.localityTitle}</div>
                  {locality.localitySections?.map((section) => (
                    <div
                      key={section.localitySectionTitle}
                      className="pt-1 text-[16px] text-foreground-body"
                    >
                      {section.localitySectionTitle}
                    </div>
                  ))}
                  <p className="pt-8 text-base text-foreground-body">{t('localityOpeningText')}</p>
                  <p className="text-[16px] text-foreground-body">
                    {locality.localityOpenFrom} - {locality.localityOpenTo}
                  </p>
                </div>
                <div className="border-r border-border-dark pl-6 text-base hover:underline">
                  <Link
                    href={getPathForEntity({ type: 'branch', slug: locality.localitySlug }) ?? ''}
                    className="uppercase"
                  >
                    <div className="relative">
                      {t('more', { ns: 'common' })} {'>'}
                    </div>
                  </Link>
                </div>
              </div>
            ))}
        </div>
      </section>
    </SectionContainer>
  )
}
export default Localities
