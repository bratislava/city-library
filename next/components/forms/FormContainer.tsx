import CloseIcon from '@assets/images/close.svg'
import cx from 'classnames'
import { useTranslation } from 'next-i18next'
import React, { ReactNode, useEffect, useState } from 'react'

import useLockedBodyScroll from '../../hooks/useLockedBodyScroll'
import useWindowSize from '../../hooks/useWindowSize'
import FormSubmittedComponent from './FormSubmittedComponent'

export const phoneRegex = /(^(\+\d{1,3}|0)(?: ?\d{3}){3}$)/
export const phoneRegexOrEmpty = /(^(\+\d{1,3}|0)(?: ?\d{3}){3}$)|^$/
export const postalCodeRegex = /^\d{5}(?:-\d{4})?$/
export const IBANRegex = /^[A-Z]{2}(?: ?\d){13,30}$/
export const IDCardRegex = /^(([a-zA-Z]{2})([0-9]{6}))$/

export enum SubmitStatus {
  NONE,
  LOADING,
  SUCCESS,
  FAILURE,
}

interface FormContainerProps {
  children: ReactNode
  buttonText: string
  title: string
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>
  isSubmitted: SubmitStatus
  onReset?: () => void
  successTitle?: string
  successMessage?: string
  errorMessage?: string
  wrapperClass?: string
}

function FormContainer({
  children,
  buttonText,
  title,
  onSubmit,
  isSubmitted,
  onReset,
  successTitle,
  successMessage,
  errorMessage,
  wrapperClass,
}: FormContainerProps) {
  const [isFormOpen, setFormOpen] = useState(false)
  const { t } = useTranslation('forms')

  const { width }: any = useWindowSize()

  const [lockedBodyScroll, setLockedBodyScroll] = useLockedBodyScroll()

  useEffect(() => {
    setFormOpen(isFormOpen && width > 767)
  }, [isFormOpen, width])

  useEffect(() => {
    setLockedBodyScroll(!isSubmitted && isFormOpen && width <= 768)
  }, [isFormOpen, setLockedBodyScroll, width, isSubmitted])

  const listener = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code === 'Enter' || event.code === 'NumpadEnter') {
      event.preventDefault()
      // onSubmit(event);
    }
  }

  return (
    <div className={cx('flex flex-col border border-gray-900 p-4', wrapperClass)}>
      {isSubmitted == SubmitStatus.NONE ? (
        <>
          <div className="mb-4 text-md md:px-4 md:pt-4 md:text-lg" id="form-title">
            {title}
          </div>
          <button
            onClick={() => setFormOpen(true)}
            className={cx(
              'flex items-center justify-center bg-gray-900 py-2 px-4 text-center text-sm uppercase text-white md:mx-4 md:mb-4',
              { hidden: isFormOpen }
            )}
            aria-labelledby="form-title"
          >
            {buttonText}
          </button>
          {isFormOpen && (
            <form
              onSubmit={onSubmit}
              className="fixed top-0 right-0 bottom-0 left-0 z-40 flex flex-col bg-white md:relative md:z-0"
              onKeyDown={() => listener}
              tabIndex={0}
            >
              {/* HEADER */}
              <div className="flex items-center justify-between border-b border-gray-900 md:hidden">
                <span className="pl-4">{title}</span>
                <button className="p-4" onClick={() => setFormOpen(false)}>
                  <CloseIcon />
                </button>
              </div>
              {/* BODY */}

              <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 pt-0">
                <div className="pt-4 text-xs text-gray-universal-70 md:pt-0">
                  {t('required_fields')} (<span className="text-error">*</span>
                  ).
                </div>
                {children}
              </div>
            </form>
          )}
        </>
      ) : (
        <FormSubmittedComponent
          submitStatus={isSubmitted}
          successTitle={successTitle}
          successMessage={successMessage}
          errorMessage={errorMessage}
          onBackToFormClick={onReset}
        />
      )}
    </div>
  )
}

export default FormContainer
