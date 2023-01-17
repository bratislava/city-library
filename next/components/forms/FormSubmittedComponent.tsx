import { CheckNoPaddingIcon, CloseIcon } from '@assets/icons'
import Button from '@modules/common/Button'
import cx from 'classnames'
import { useTranslation } from 'next-i18next'
import React from 'react'

import { SubmitStatus } from './FormContainer'

type IProps = {
  className?: string
  onBackToFormClick?: () => void
  successTitle?: string
  successMessage?: string
  errorMessage?: string
  submitStatus: SubmitStatus
}

const FormSubmittedComponent = ({
  className,
  onBackToFormClick,
  successTitle,
  successMessage,
  errorMessage,
  submitStatus,
}: IProps) => {
  const { t } = useTranslation('forms')

  return (
    <div className={cx('py-4', className)}>
      <div className="flex h-full w-full flex-col items-center justify-center gap-y-8 text-center">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-border-dark bg-button-dark text-base text-white">
          {submitStatus == SubmitStatus.SUCCESS && <CheckNoPaddingIcon />}
          {submitStatus == SubmitStatus.FAILURE && <CloseIcon />}
        </span>
        <div className="space-y-4">
          <h5 className="text-foreground-heading">
            {submitStatus == SubmitStatus.SUCCESS && (successTitle || t('generic_success_title'))}
            {submitStatus == SubmitStatus.FAILURE && t('generic_error_title')}
          </h5>
          <p className="text-base text-foreground-body">
            {submitStatus == SubmitStatus.SUCCESS &&
              (successMessage || t('generic_success_message'))}
            {submitStatus == SubmitStatus.FAILURE && (errorMessage || t('generic_error_message'))}
          </p>
        </div>
        <Button variant="secondary" onPress={onBackToFormClick}>
          {t('thank_you_button_content')}
        </Button>
      </div>
    </div>
  )
}

export default FormSubmittedComponent
