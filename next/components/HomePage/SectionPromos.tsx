import PromoEventCard from '@modules/cards-and-rows/PromoEventCard'
import PromoNewsCard from '@modules/cards-and-rows/PromoNewsCard'
import { EventCardEntityFragment, NoticeListingEntityFragment } from '@services/graphql'
import { isDefined, withAttributes } from '@utils/isDefined'

import Carousel from '../../modules/common/Carousel/Carousel'

interface SectionPromosProps {
  promos: (EventCardEntityFragment | NoticeListingEntityFragment)[]
}

// TODO: sizes are now hardcoded, should be calculated to fit the screen

const SectionPromos = ({ promos }: SectionPromosProps) => {
  return (
    <Carousel
      listClassName="gap-4 px-4 lg:-mx-2 lg:px-2 h-full lg:gap-5 py-2 -my-2"
      itemClassName="w-10/12 max-w-[268px] md:max-w-[379px]"
      className="my-10"
      shiftIndex={3}
      items={promos
        ?.map((promo) => {
          switch (promo.__typename) {
            case 'EventEntity':
              return {
                element: <PromoEventCard event={withAttributes(promo)} />,
                key: promo?.attributes?.slug,
              }

            case 'NoticeEntity':
              return {
                element: <PromoNewsCard notice={promo} />,
                key: promo?.attributes?.slug,
              }

            default:
              return { element: null, key: undefined }
          }
        })
        .filter(isDefined)}
    />
  )
}

export default SectionPromos
