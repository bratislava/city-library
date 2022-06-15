import { DateTimeSelect, Input } from '@bratislava/ui-city-library'
import { LocalDate } from '@js-joda/core'
import React from 'react'
import { Controller, useForm, FormProvider } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import FormFooter from '../FormFooter'
import { useTranslation } from 'next-i18next'
import RadioGroup from '@bratislava/ui-city-library/RadioGroup/RadioGroup'
import { convertDataToBody, useGetFormOptions } from '../../../utils/form-constants'
import { options } from './options'
import FormContainer, { phoneRegex } from '../FormContainer'
import isEmpty from 'lodash/isEmpty'
import { useRouter } from 'next/router'

const TabletReservationForm = () => {
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
      fName: yup.string().required(),
      lName: yup.string().required(),
      readerCardNumber: yup.string().required(),
      email: yup.string().email().required(),
      phone: yup.string().matches(phoneRegex, t('validation_error_phone')).required(),
      dateFrom: yup.date().min(LocalDate.now().toString()).required(),
      dateTo: yup.date().min(LocalDate.now().toString()).required(),
      timeFrom: yup.string().required(),
      timeTo: yup.string().required(),
      where: yup.string().required(),
      acceptFormTerms: yup.boolean().isTrue(),
    })
    .required()

  const selectOptions = useGetFormOptions(options)
  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      fName: '',
      lName: '',
      readerCardNumber: '',
      email: '',
      phone: '',
      dateFrom: '',
      dateTo: '',
      timeFrom: '',
      timeTo: '',
      where: selectOptions[0].key,
    },
  })
  const { errors } = methods.formState

  const hasErrors = !isEmpty(Object.keys(errors).filter((k) => k !== 'acceptFormTerms'))

  const handleSubmit = methods.handleSubmit(async (data) => {
    const temp = convertDataToBody(data, t)

    // additional params
    const body = {
      ...temp,
      ...{
        mg_subject: null,
        mg_email_to: 'info@mestskakniznica.sk',
        meta_sent_from: router.asPath,
        meta_locale: router.locale,
      },
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
        title={t('tablet_reservation_title')}
        buttonText={t('common:continue')}
        onSubmit={handleSubmit}
        isSubmitted={isSubmitted}
        onReset={() => setIsSubmitted(false)}
        successTitle={t('reservation_success_title')}
        successMessage={t('reservation_success_message')}
        errorMessage={t('generic_error_message')}
      >
        <div className="flex flex-col gap-y-6 w-full mt-4">
          <div className="flex flex-col gap-y-6 gap-x-6 lg:flex-row justify-between">
            <Controller
              control={methods.control}
              name="fName"
              render={({ field: { ref, ...field } }) => (
                <Input
                  id="first_name_input"
                  labelContent={t('first_name')}
                  className="w-full"
                  inputClassName="px-3 w-full"
                  hasError={!!errors.fName}
                  errorMessage={errors.fName?.message}
                  required
                  {...field}
                />
              )}
            />
            <Controller
              control={methods.control}
              name="lName"
              render={({ field: { ref, ...field } }) => (
                <Input
                  id="last_name_input"
                  labelContent={t('last_name')}
                  className="w-full"
                  inputClassName="px-3 w-full"
                  hasError={!!errors.lName}
                  errorMessage={errors.lName?.message}
                  required
                  {...field}
                />
              )}
            />
          </div>
          <div className="w-full lg:w-6/12 lg:pr-3">
            <Controller
              control={methods.control}
              name="readerCardNumber"
              render={({ field: { ref, ...field } }) => (
                <Input
                  id="reader_card_input"
                  labelContent={t('reader_card_number')}
                  inputClassName="px-3 w-full"
                  hasError={!!errors.readerCardNumber}
                  errorMessage={errors.readerCardNumber?.message}
                  required
                  {...field}
                />
              )}
            />
          </div>
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

          <div className="w-full lg:w-6/12 lg:pr-3">
            <Controller
              control={methods.control}
              name="phone"
              render={({ field: { ref, ...field } }) => (
                <Input
                  id="phone_input"
                  type="phone"
                  labelContent={t('phone')}
                  className="w-full"
                  inputClassName="px-3 w-full"
                  hasError={!!errors.phone}
                  errorMessage={errors.phone?.message}
                  required
                  {...field}
                />
              )}
            />
          </div>

          <div className="flex flex-col gap-y-6 gap-x-6 lg:flex-row justify-between">
            <Controller
              control={methods.control}
              name="dateFrom"
              render={({ field: { ref, ...field } }) => (
                <DateTimeSelect
                  id="date_from_input"
                  type="date"
                  labelContent={t('reservation_date_from')}
                  className="w-full"
                  inputClassName="w-full"
                  hasError={!!errors.dateFrom}
                  errorMessage={errors.dateFrom?.message}
                  required
                  {...field}
                />
              )}
            />
            <Controller
              control={methods.control}
              name="timeFrom"
              render={({ field: { ref, ...field } }) => (
                <DateTimeSelect
                  id="time_from_input"
                  type="time"
                  labelContent={t('reservation_time')}
                  className="w-full"
                  inputClassName="w-full  "
                  hasError={!!errors.timeFrom}
                  errorMessage={errors.timeFrom?.message}
                  required
                  {...field}
                />
              )}
            />
          </div>
          <div className="flex flex-col gap-y-6 gap-x-6 lg:flex-row justify-between">
            <Controller
              control={methods.control}
              name="dateTo"
              render={({ field: { ref, ...field } }) => (
                <DateTimeSelect
                  id="date_to_input"
                  type="date"
                  labelContent={t('reservation_date_to')}
                  className="w-full"
                  inputClassName="w-full"
                  hasError={!!errors.dateTo}
                  errorMessage={errors.dateTo?.message}
                  required
                  {...field}
                />
              )}
            />
            <Controller
              control={methods.control}
              name="timeTo"
              render={({ field: { ref, ...field } }) => (
                <DateTimeSelect
                  id="time_to_input"
                  type="time"
                  labelContent={t('reservation_time')}
                  className="w-full"
                  inputClassName="w-full"
                  hasError={!!errors.timeTo}
                  errorMessage={errors.timeTo?.message}
                  required
                  {...field}
                />
              )}
            />
          </div>

          <Controller
            control={methods.control}
            name="where"
            render={({ field: { onChange, value } }) => (
              <RadioGroup
                id="reader_form_where"
                labelContent={t('tablet_form_where')}
                className="flex flex-col gap-x-4 gap-y-4"
                wrapperClassName="w-full"
                radioClassName="w-full"
                options={selectOptions}
                hasError={!!errors.where}
                errorMessage={t('validation_error_radiogroup')}
                value={value}
                onChange={(opt) => onChange(opt)}
                required
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

export default TabletReservationForm
