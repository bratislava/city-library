import { yupResolver } from '@hookform/resolvers/yup'
import { useTranslation } from 'next-i18next'
import React, { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import * as yup from 'yup'

import { NewsLetter } from '@/components/ui'

const schema = yup
  .object({
    email: yup.string().email().required(),
    acceptTerms: yup.boolean().isTrue(),
  })
  .required()

const NewsletterSection = () => {
  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
    },
  })

  const [subscribed, setSubscribed] = useState(false)
  const [resStatus, setResStatus] = useState(false)
  const [respondMessage, setRespondMessage] = useState('')
  const { t } = useTranslation('newsletter')

  const handleSubmit = methods.handleSubmit(async (data) => {
    const res = await fetch('/api/subscribe', {
      body: JSON.stringify({
        email: data.email,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })

    const { error } = await res.json()
    if (error) {
      console.error(error)
      if (error.trim() == 'Bad Request') {
        setRespondMessage(t('subscribe_bad_request_message'))
      } else {
        setRespondMessage(t('subscribe_error_message'))
      }
      // TODO: duplicate email gives error 500
      return
    }

    setResStatus(true)
    methods.setValue('email', '')
    setRespondMessage(t('subscribe_success_message'))
    // setSubscribed(true);
    // TODO: after success remove email from input
    // TODO: this would be better as hook or in component
  })

  return (
    <>
      {!subscribed ? (
        <FormProvider {...methods}>
          <NewsLetter
            title={t('newsletter_title')}
            inputPlaceholder={t('newsletter_placeholder')}
            buttonContent={t('newsletter_button')}
            checkboxContent={
              <div
                className="text-base md:w-[580px]"
                dangerouslySetInnerHTML={{ __html: t('newsletter_checkbox') }}
              />
            }
            errorMessage={t('newsletter_error')}
            onSubmit={handleSubmit}
            respondMessage={respondMessage}
            resStatus={resStatus}
          />
        </FormProvider>
      ) : (
        <div className="container flex flex-col items-center justify-center">
          <h2 className="pt-30 pb-6 text-h3">{t('newsletter_sent_title')}</h2>
          <div className="m-auto w-[780px] pb-30 text-center text-base text-foreground-body">
            {t('newsletter_sent_text')}
          </div>
        </div>
      )}
    </>
  )
}

export default NewsletterSection
