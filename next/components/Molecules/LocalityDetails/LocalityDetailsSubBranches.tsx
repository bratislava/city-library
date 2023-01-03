import BusinessSvg from '@assets/images/business.svg'
import MailSvg from '@assets/images/mail.svg'
import PhoneSvg from '@assets/images/phone.svg'
import { BranchEntityFragment } from '@bratislava/strapi-sdk-city-library'
import Accordion from '@modules/common/Accordion'
import { useTranslation } from 'next-i18next'
import React from 'react'

type LocalityDetailsContactUsProps = {
  branch: BranchEntityFragment
}

const LocalityDetailsContactUs = ({ branch }: LocalityDetailsContactUsProps) => {
  const { t } = useTranslation('common')

  if (!branch?.attributes?.subBranches?.data.length) {
    return null
  }

  return (
    <div className="pt-10" id="sections">
      <div className="text-[24px]">{t('sections')}</div>
      <div className="pt-5">
        {branch.attributes.subBranches.data.map((subBranch) => (
          <Accordion
            key={subBranch?.id}
            title={subBranch?.attributes?.title}
            type="sublocation"
            iconLeft={<BusinessSvg />}
          >
            <div className="mb-3">
              {/* TODO replace by PhoneButton */}
              {subBranch.attributes?.phone && (
                <div className="mb-2 flex items-center">
                  <span className="mr-4 mb-[1px] inline-flex">
                    <PhoneSvg />
                  </span>
                  {/* eslint-disable-next-line @typescript-eslint/restrict-template-expressions */}
                  <a href={`tel:${subBranch.attributes?.phone}`} className="hover:underline">
                    {subBranch.attributes?.phone}
                  </a>
                </div>
              )}
              {/* TODO replace by MailButton */}
              {subBranch.attributes?.email && (
                <div className="mb-2 flex items-center">
                  <span className="mr-4 mb-[1px] inline-flex">
                    <MailSvg />
                  </span>
                  {/* eslint-disable-next-line @typescript-eslint/restrict-template-expressions */}
                  <a href={`mailto:${subBranch.attributes?.email}`} className="hover:underline">
                    {subBranch.attributes?.email}
                  </a>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2 py-2">
              {subBranch.attributes?.openingHours?.days.map((day) => (
                <div className="flex max-w-[340px] justify-between">
                  <div>{day?.label}</div>
                  <div>{day?.time}</div>
                </div>
              ))}
            </div>
          </Accordion>
        ))}
      </div>
    </div>
  )
}

export default LocalityDetailsContactUs
