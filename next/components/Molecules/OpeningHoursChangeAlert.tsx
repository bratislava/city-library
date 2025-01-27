import MLink from '@modules/common/MLink'
import { client } from '@services/graphql/gql'
import { isDefined } from '@utils/isDefined'
import { useNavikronos } from '@utils/navikronos'
import { useTranslation } from 'next-i18next'
import React, { Fragment } from 'react'
import { useQuery } from 'react-query'

const OpeningHoursChangeAlert = () => {
  const { t, i18n } = useTranslation()
  const locale = i18n.language

  const { getPathForStrapiEntity } = useNavikronos()

  const { data: noticesData } = useQuery({
    queryFn: () => client.OpeningHoursChangeNotices({ locale }),
    queryKey: ['OpeningHoursChangeBlogPosts', locale],
  })

  // eslint-disable-next-line unicorn/no-array-callback-reference
  const filteredNotices = noticesData?.notices?.data.filter(isDefined) ?? []

  if (filteredNotices.length === 0) return null

  return (
    <div className="flex flex-col gap-5 bg-promo-peach p-5">
      <h2 className="text-h5">{t('openingHoursChangeAlertTitle')}</h2>
      <div className="flex flex-col gap-6">
        {filteredNotices
          ?.map((notice, index) => {
            if (!notice.attributes) return null

            const { title } = notice.attributes
            const link = getPathForStrapiEntity(notice)

            return (
              // eslint-disable-next-line react/no-array-index-key
              <Fragment key={index}>
                {index > 0 && <hr />}
                <div className="flex flex-col gap-3">
                  <p className="text-foreground-body">{title}</p>
                  <MLink href={link ?? ''} variant="basic" hasIcon>
                    {t('showMore')}
                  </MLink>
                </div>
              </Fragment>
            )
          })
          // eslint-disable-next-line unicorn/no-array-callback-reference
          .filter(isDefined)}
      </div>
    </div>
  )
}

export default OpeningHoursChangeAlert
