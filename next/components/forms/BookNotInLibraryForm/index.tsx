import { Input, TextArea } from '@bratislava/ui-city-library'
import { yupResolver } from '@hookform/resolvers/yup'
import isEmpty from 'lodash/isEmpty'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import React from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import * as yup from 'yup'

import { convertDataToBody } from '../../../utils/form-constants'
import FormContainer from '../FormContainer'
import FormFooter from '../FormFooter'

function BookNotInLibraryForm() {
  const [isSubmitted, setIsSubmitted] = React.useState(false)
  const { t } = useTranslation(['forms', 'common'])
  const router = useRouter()

  yup.setLocale({
    mixed: {
      required: t('validation_error_required'),
      notType: t('validation_error_required'),
    },
    string: {
      email: t('validation_error_email'),
    },
    date: {
      min: t('validation_error_date_gt_today'),
      max: t('validation_error_date_lt_today'),
    },
    number: {
      min: t('validation_error_number_gt_zero'),
    },
  })

  const schema = yup
    .object({
      email: yup.string().email().required(),
      message: yup.string().required(),
      acceptFormTerms: yup.boolean().isTrue(),
    })
    .required()

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      message: '',
    },
  })
  const { errors } = methods.formState

  const hasErrors = !isEmpty(Object.keys(errors).filter((k) => k !== 'acceptFormTerms'))

  const handleSubmit = methods.handleSubmit(async (data) => {
    const temp = convertDataToBody(data, t)

    // additional params
    const body = {
      ...temp,
      
        mg_subject: null,
        mg_email_to: 'info@mestskakniznica.sk',
        meta_sent_from: router.asPath,
        meta_locale: router.locale
      ,
    }

    // send email
    const res = await fetch(`/api/submit-form`, {
      method: 'POST',
      // @ts-ignore
      body: JSON.stringify(body),
    })

    // catch error
    const { error } = await res.json()
    if (error) {
      console.log('error sending form', error)
      return
    }

    // show thank you message
    setIsSubmitted(true)
  })

  return (
    <FormProvider {...methods}>
      <FormContainer
        title={t('book_not_in_library_title')}
        buttonText={t('common:continue')}
        onSubmit={handleSubmit}
        isSubmitted={isSubmitted}
        onReset={() => setIsSubmitted(false)}
        successTitle={t('book_not_in_library_success_title')}
        successMessage={t('book_not_in_library_success_message')}
        errorMessage={t('generic_error_message')}
      >
        <div className="flex flex-col gap-y-6 w-full mt-4">
          <Controller
            control={methods.control}
            name="email"
            render={({ field: { ref, ...field } }) => (
              <Input
                id="email_input"
                type="email"
                labelContent={t('email')}
                inputClassName="px-3 w-full"
                hasError={!!errors.email}
                errorMessage={errors.email?.message}
                required
                {...field}
              />
            )}
          />

          <Controller
            control={methods.control}
            name="message"
            render={({ field: { ref, ...field } }) => (
              <TextArea
                id="message_input"
                labelContent={t('message')}
                textAreaClassname="w-full h-[122px]"
                hasError={!!errors.message}
                errorMessage={errors.message?.message}
                required
                {...field}
              />
            )}
          />
          {hasErrors && <p className="text-base text-error ">{t('please_fill_required_fields')}</p>}
          <FormFooter buttonContent={t('send')} />
        </div>
      </FormContainer>
    </FormProvider>
  )
}

export default BookNotInLibraryForm
