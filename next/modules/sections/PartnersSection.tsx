import PartnerCardRow from '@modules/cards-and-rows/PartnerCardRow'
import { getPartnersQueryKey, partnersFetcher } from '@services/graphql/fetchers/partners.fetcher'
import { useTranslation } from 'next-i18next'
import React from 'react'
import { useQuery } from 'react-query'

const PartnersSection = () => {
  const { i18n } = useTranslation('common')

  // There's no need to handle loading, as the data are prefetched and never change.
  const { data } = useQuery({
    queryKey: getPartnersQueryKey(i18n.language),
    queryFn: () => partnersFetcher(i18n.language),
    staleTime: Infinity, // The data are static and don't need to be reloaded.
  })

  return (
    <>
      {data?.featuredPartners && data.featuredPartners.data.length > 0 && (
        <ul className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
          {data.featuredPartners.data.map((partner, index) => (
            <PartnerCardRow
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              id={`featured-partner-${index}`}
              title={partner?.attributes?.title ?? ''}
              logo={partner?.attributes?.logo?.data?.attributes?.url ?? ''}
              linkHref={partner?.attributes?.url ?? '#'}
              featured
            />
          ))}
        </ul>
      )}

      {data?.notFeaturedPartners && data.notFeaturedPartners.data.length > 0 && (
        <ul className="mt-12 flex flex-col lg:space-y-3">
          {data.notFeaturedPartners.data.map((partner, index) => (
            <PartnerCardRow
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              id={`non-featured-partner-${index}`}
              title={partner?.attributes?.title || ''}
              linkHref={partner?.attributes?.url || ''}
            />
          ))}
        </ul>
      )}
    </>
  )
}

export default PartnersSection
