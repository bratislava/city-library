import { SectionContainer } from '@bratislava/ui-city-library'
import LocalityDetails from '@components/Molecules/LocalityDetails/LocalityDetails'
import Breadcrumbs from '@modules/breadcrumbs/Breadcrumbs'
import { useTranslation } from 'next-i18next'

import { BranchEntityFragment } from '../../graphql'
import Section from '../AppLayout/Section'

export interface PageProps {
  branch: BranchEntityFragment
}

const BranchPage = ({ branch }: PageProps) => {
  const { t, i18n } = useTranslation(['common', 'homepage'])

  const breadCrumbs =
    i18n.language === 'sk'
      ? [
          { title: 'Navštívte', url: '/navstivte' },
          { title: 'Naše lokality', url: '/navstivte/nase-lokality' },
          { title: branch.attributes?.title || '', url: branch.attributes?.slug || '' },
        ]
      : [
          { title: 'Visit', url: '/visit' },
          { title: 'Our locations', url: '/visit/our-locations' },
          { title: branch.attributes?.title || '', url: branch.attributes?.slug || '' },
        ]

  return (
    <>
      <SectionContainer>
        <Breadcrumbs crumbs={breadCrumbs} />
      </SectionContainer>
      <SectionContainer>
        {/* TODO add gallery */}
        <Section>
          <LocalityDetails branch={branch} />
        </Section>
      </SectionContainer>
    </>
  )
}

export default BranchPage
