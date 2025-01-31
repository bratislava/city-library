import { SectionContainer } from '@bratislava/ui-city-library'
import BranchDetails from '@components/Molecules/BranchDetails/BranchDetails'
import { BranchEntityFragment } from '@services/graphql'

import Breadcrumbs from '@/modules/breadcrumbs/Breadcrumbs'
import { useNavikronos } from '@/utils/navikronos'

export interface PageProps {
  branch: BranchEntityFragment
}

const BranchPage = ({ branch }: PageProps) => {
  const { breadcrumbs } = useNavikronos()

  return (
    <>
      <SectionContainer>
        <Breadcrumbs crumbs={breadcrumbs} />
      </SectionContainer>
      <SectionContainer>
        <BranchDetails branch={branch} />
      </SectionContainer>
    </>
  )
}

export default BranchPage
