import Calendar from '@assets/images/calendar.svg'
import SmCalendar from '@assets/images/calendar-sm.svg'
import QrLogo from '@assets/images/camera.svg'
import Directions from '@assets/images/directions.svg'
import Euro from '@assets/images/euro-symbol.svg'
import Navigate from '@assets/images/navigate.svg'
import Share from '@assets/images/share.svg'
import { useUIContext } from '@bratislava/common-frontend-ui-context'
import AddToCalendar from '@culturehq/add-to-calendar'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import QRCode from 'qrcode.react'
import React from 'react'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import Placeholder from '../../assets/images/event-detail-placeholder.jpg'
import { EventEntityFragment } from '../../graphql'
import { dateTimeString, isEventPast } from '../../utils/utils'
import DateCardDisplay from '../Atoms/DateCardDispaly'
import Clickable from '../Atoms/EventClickable'
import DetailsRow from '../Atoms/EventDetailsRow'
import TagsDisplay from '../Atoms/TagsDisplay'
import { usePageWrapperContext } from '../layouts/PageWrapper'

export interface PageProps {
  event?: EventEntityFragment
}

const EventDetails = ({ event }: PageProps) => {
  const { t } = useTranslation('common')
  const { asPath } = useRouter()
  const { Markdown: UIMarkdown } = useUIContext()
  const [isEventInThePast, setIsEventInThePast] = React.useState(false)
  const { locale } = usePageWrapperContext()

  const copyToClipBoard = () => {
    navigator.clipboard.writeText(`https://www.mestskakniznica.sk${asPath}`)
  }

  const fireSwal = () => {
    const withContent = withReactContent(Swal)
    withContent.fire({
      html: (
        <QRCode
          value={event?.attributes?.title || ''}
          className="m-auto"
          renderAs="svg"
          size={240}
        />
      ),
      position: 'center',
      width: 350,
      confirmButtonText: t('close'),
      confirmButtonColor: '#2f2f2f',
      customClass: {
        popup: 'rounded-none',
        confirmButton: 'rounded-none',
      },
    })
  }

  React.useMemo(() => {
    setIsEventInThePast(isEventPast(event?.attributes?.dateTo))
  }, [event])

  // fallback to placeholder
  const bannerProps = {
    url: Placeholder.src,
    width: Placeholder.width,
    height: Placeholder.height,
    alternativeText: t('eventDetailImagePlaceholder'),
    ...(event?.attributes?.coverImage?.data?.attributes),
  }

  return (
    <>
      <img
        src={bannerProps.url}
        width={bannerProps.width || 0}
        height={bannerProps.height || 0}
        alt={bannerProps.alternativeText || t('eventDetailImagePlaceholder')}
        className="object-cover object-center md:h-[300px] lg:h-[400px]"
      />
      <div className="block grid-cols-9 gap-x-16 pt-10 lg:grid">
        <div className="col-span-1 hidden h-[108px] w-[108px] bg-promo-yellow text-center lg:flex">
          <DateCardDisplay
            dateFrom={event?.attributes?.dateFrom}
            dateTo={event?.attributes?.dateTo}
            textSize="text-lg"
          />
        </div>
        <div className="col-span-5">
          <div className="text-xs">
            <TagsDisplay
              tags={event?.attributes?.eventTags?.data || []}
              category={event?.attributes?.eventCategory?.data?.attributes?.title || ''}
              tagsCount={5}
            />
          </div>
          <h1 className="py-[12px] text-[32px] leading-[38px]">{event?.attributes?.title}</h1>
          <div className="text-[14px] text-gray-500">
            {dateTimeString(event?.attributes?.dateFrom, event?.attributes?.dateTo, locale)}
          </div>
        </div>
        {/* TODO validate this - what is event reservation and is it used ? */}
        {/* <div className="col-span-3 mt-4 w-full lg:m-auto">
          {!isEventInThePast && (
            <a
              href="#detail_podujatia"
              className="base-button h-12 w-full border border-gray-universal-100 bg-gray-universal-100 text-white hover:bg-gray-universal-80"
            >
              {t('eventReservation')}
            </a>
          )}
        </div> */}
      </div>

      <div className="flex grid-cols-9 flex-col-reverse gap-x-16 pt-10 lg:grid">
        <div className="col-span-6">
          <div className="mt-8 border-b border-gray-700 pb-10 lg:mt-0">
            <div className="text-[24px]">{t('description')}</div>
            <div className="pt-5 text-[16px] text-gray-500">
              <UIMarkdown content={event?.attributes?.description || ''} />
            </div>
          </div>
          {(event?.attributes?.guests?.length || 0) > 0 && (
            <div className="border-b border-gray-700 py-10">
              <div className="text-[24px]">{t('eventGuests')}</div>
              <div className="grid grid-cols-3 pt-5">
                {event?.attributes?.guests?.map((guest) => (
                  <div key={guest?.id} className="flex pr-[24px]">
                    <img
                      src={guest?.avatar?.data?.attributes?.url}
                      width={guest?.avatar?.data?.attributes?.width || 0}
                      height={guest?.avatar?.data?.attributes?.height || 0}
                      alt={guest?.name || 'Guest name.'}
                      className="flex h-12 w-12 items-center justify-center rounded-full object-cover"
                    />
                    <span className="m-auto text-[16px]">
                      {guest?.name} {guest?.surname}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* {(eventDetails?.partners?.length || 0) > 0 && (
            <div className="border-b border-gray-700 pb-10 pt-10">
              <div className="text-[24px]">{t('eventPartners')}</div>
              <div className="grid grid-cols-3 pt-5">
                {eventDetails?.partners?.map((partner) => (
                  <div key={partner?.id} className="flex pr-[24px]">
                    <img
                      src={partner?.image?.url}
                      width={partner?.image?.width || 0}
                      height={partner?.image?.height || 0}
                      alt="partner"
                      className="rounded-full h-12 w-12 flex items-center justify-center object-cover"
                    />
                    <span className="m-auto text-[16px]">{partner?.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )} */}
          <div className="pt-10">
            <div className="block h-auto border-y border-gray-900 py-3 lg:flex lg:h-[70px] lg:border lg:p-0">
              {/* <div className="hidden lg:block pl-6 w-[169px] text-sm m-auto"> */}
              {/*  {t('eventShareAndSave')} */}
              {/* </div> */}
              {!isEventInThePast && (
                <div className="my-3 lg:m-auto">
                  <AddToCalendar
                    event={{
                      name: event?.attributes?.title || '',
                      details: event?.attributes?.description?.replace(/\n/g, ' ') || null,
                      location: event?.attributes?.eventLocality?.data?.attributes?.title || null,
                      startsAt: new Date(event?.attributes?.dateFrom).toISOString(),
                      endsAt: new Date(event?.attributes?.dateTo).toISOString(),
                    }}
                    filename="library-event"
                  >
                    <div className="flex text-xs uppercase">
                      <SmCalendar />
                      &nbsp; {t('eventAddToCalendar')}
                    </div>
                  </AddToCalendar>
                </div>
              )}

              <Clickable
                actionLink={copyToClipBoard}
                classA="flex text-xs uppercase"
                classDiv="my-3 lg:m-auto"
                svgIcon={<Share />}
                text={t('eventShare')}
                copyText
              />
              <Clickable
                actionLink={fireSwal}
                classA="flex text-xs uppercase"
                classDiv="my-3 lg:m-auto"
                svgIcon={<QrLogo />}
                text={t('eventQr')}
              />
            </div>
          </div>
        </div>
        <div className="col-span-3 text-[24px]">
          {t('details')}
          <div className="pt-5">
            <div className="border-y border-gray-900 text-sm lg:border">
              <div className="m-5">
                <div className="border-b border-gray-300 pb-5">
                  <DetailsRow
                    classWrapper="flex"
                    svgIcon={<Calendar />}
                    text={dateTimeString(
                      event?.attributes?.dateFrom,
                      event?.attributes?.dateTo,
                      locale
                    )}
                  />
                  {!isEventInThePast && (
                    <div className="pl-9 pt-3">
                      <AddToCalendar
                        event={{
                          name: event?.attributes?.title || '',
                          details: event?.attributes?.description?.replace(/\n/g, ' ') || null,
                          location:
                            event?.attributes?.eventLocality?.data?.attributes?.title || null,
                          startsAt: new Date(event?.attributes?.dateFrom).toISOString(),
                          endsAt: new Date(event?.attributes?.dateTo).toISOString(),
                        }}
                        filename="library-event"
                      >
                        <div className="flex text-xs uppercase">
                          <SmCalendar />
                          &nbsp; {t('eventAddToCalendar')}
                        </div>
                      </AddToCalendar>
                    </div>
                  )}
                </div>
                <div className="border-b border-gray-300 py-5">
                  <DetailsRow
                    classWrapper="flex"
                    svgIcon={<Navigate />}
                    text={`${event?.attributes?.eventLocality?.data?.attributes?.title}${
                      event?.attributes?.eventLocality?.data?.attributes?.eventAddress
                        ? `, ${event?.attributes?.eventLocality?.data?.attributes?.eventAddress}`
                        : ``
                    }`}
                  />
                  <Clickable
                    actionLink={`https://www.google.com/maps/dir/?api=1&travelmode=driving&dir_action=navigate&destination=${event?.attributes?.eventLocality?.data?.attributes?.navigateTo}`}
                    classA="flex text-sm uppercase"
                    classDiv="pl-9 pt-3"
                    svgIcon={<Directions />}
                    text={t('navigate')}
                  />
                </div>

                <DetailsRow
                  classWrapper="flex pt-5"
                  svgIcon={<Euro />}
                  text={
                    !event?.attributes?.price || event?.attributes?.price == 0
                      ? t('noCharge').toString()
                      : event?.attributes?.price?.toString() || ''
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default EventDetails
