import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import { Maybe, UploadFileEntity } from '@bratislava/strapi-sdk-city-library'

interface PremiseCardProps {
  title: string
  address: string
  url: string
  image: Maybe<UploadFileEntity> | undefined
}

function PremiseCard({ title, address, url, image }: PremiseCardProps) {
  const { t } = useTranslation('common')
  return (
    <Link href={url} passHref>
      <a href={url}>
        <div key={title} className="w-full relative">
          <img src={image?.attributes?.url ?? ''} alt={image?.attributes?.alternativeText ?? ''} className="w-full h-48 object-cover" />
          <div className="">
            <div className="pt-4">{title}</div>
            <div className="text-sm pt-3 leading-[19.6px] text-gray-universal-70">{address}</div>
            <div className="text-sm cursor-pointer pt-6 uppercase">
              {t('showDetails')} {'>'}
            </div>
          </div>
        </div>
      </a>
    </Link>
  )
}

export default PremiseCard
