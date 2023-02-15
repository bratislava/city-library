import { SectionContainer } from '@bratislava/ui-city-library'
import BranchDetails from '@components/Molecules/BranchDetails/BranchDetails'
import Breadcrumbs from '@modules/breadcrumbs/Breadcrumbs'
import { BranchEntityFragment } from '@services/graphql'
import { useTranslation } from 'next-i18next'

import Section from '../AppLayout/Section'
import { useNavikronos } from '@utils/navikronos'

export interface PageProps {
  branch: BranchEntityFragment
}

const BranchPage = ({ branch }: PageProps) => {
  const { getBreadcrumbs } = useNavikronos()
  const breadcrumbs = getBreadcrumbs(branch.attributes?.title)

  return (
    <>
      <SectionContainer>
        <Breadcrumbs crumbs={breadcrumbs} />
      </SectionContainer>
      <SectionContainer>
        <Section>
          <BranchDetails branch={branch} />
        </Section>
      </SectionContainer>
    </>
  )
}

export default BranchPage
