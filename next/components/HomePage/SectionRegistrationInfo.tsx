import { CheckNoPaddingIcon } from '@assets/icons'
import RegisterToLibrary from '@assets/images/register-to-library.svg'
import Button from '@modules/common/Button'
import { ComponentHomepageRegistrationInfo } from '@services/graphql'
import { useTranslation } from 'next-i18next'
import React from 'react'
import { useNavikronos } from '@utils/navikronos'

interface RegistrationInfoProps {
  registrationInfoSection: ComponentHomepageRegistrationInfo
}

const RegistrationInfo = ({ registrationInfoSection }: RegistrationInfoProps) => {
  const { t } = useTranslation('homepage')
  const { getPathForEntity } = useNavikronos()
  const registerToLibraryId = registrationInfoSection?.redirectTo?.data?.id

  return (
    <section className="pb-12">
      <div className="flex w-full">
        <div className="flex w-full flex-col pt-12 md:flex-row md:space-x-8 md:px-8 lg:px-16">
          <div className="mx-auto w-full max-w-sm">
            <RegisterToLibrary />
          </div>
          <div className="w-full">
            <h2 className="text-center text-h3 md:text-left">{registrationInfoSection?.title}</h2>
            <div className="pt-6 text-base">{registrationInfoSection?.description}</div>

            <ul>
              {registrationInfoSection?.registrationBenefits?.map((benefit) => (
                <li className="flex pt-3 text-base" key={benefit?.id}>
                  <CheckNoPaddingIcon className="mr-4 mt-[6px] inline shrink-0" />{' '}
                  {/* <Check className="inline-flex scale-75 text-base md:scale-100" />{' '} */}
                  {benefit?.benefit}
                </li>
              ))}
            </ul>

            <div className="pt-8">
              {registerToLibraryId && (
                <Button href={getPathForEntity({ type: 'page', id: registerToLibraryId }) ?? ''}>
                  {t('registerToLibraryButton')}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default RegistrationInfo
