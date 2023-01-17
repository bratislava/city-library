import { EventEntityFragment, GeneralQuery } from '@services/graphql'
import { generalFetcher } from '@services/graphql/fetchers/general.fetcher'
import { client } from '@services/graphql/gql'
import { GeneralContextProvider } from '@utils/generalContext'
import { isDefined } from '@utils/isDefined'
import { isPresent, shouldSkipStaticPaths } from '@utils/utils'
import last from 'lodash/last'
import { GetStaticPaths, GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import DefaultPageLayout from '../../components/layouts/DefaultPageLayout'
import PageWrapper from '../../components/layouts/PageWrapper'
import ErrorDisplay, { getError, IDisplayError } from '../../components/Molecules/ErrorDisplay'
import ErrorPage from '../../components/pages/ErrorPage'
import EventPage from '../../components/pages/eventPage'

interface IPageProps {
  locale: string
  event: EventEntityFragment
  general: GeneralQuery
  error?: IDisplayError
}

const EventSlugPage = ({ event, general, error }: IPageProps) => {
  if (error) {
    return (
      <ErrorPage code={500}>
        <ErrorDisplay error={error} />
      </ErrorPage>
    )
  }

  return (
    <GeneralContextProvider general={general}>
      <PageWrapper
        locale={event.attributes?.locale ?? ''}
        slug={event.attributes?.slug ?? ''}
        localizations={event.attributes?.localizations?.data
          .filter(isPresent)
          .map((localization) => ({
            locale: localization.attributes?.locale,
            slug: localization.attributes?.slug,
          }))}
      >
        <DefaultPageLayout title={event.attributes?.title} Seo={event.attributes?.Seo}>
          <EventPage event={event} />
        </DefaultPageLayout>
      </PageWrapper>
    </GeneralContextProvider>
  )
}

export const getStaticPaths: GetStaticPaths = async ({ locales = ['sk', 'en'] }) => {
  let paths: Array<{ params: { fullPath: string[]; locale: string } }> = []
  if (shouldSkipStaticPaths()) return { paths, fallback: 'blocking' }

  const pathArraysForLocales = await Promise.all(
    locales.map((locale) => client.EventStaticPaths({ locale }))
  )
  const events = pathArraysForLocales
    .flatMap(({ events: eventsInner }) => eventsInner?.data || [])
    .filter(isDefined)

  if (events.length > 0) {
    paths = events
      .filter((event) => event.attributes?.slug)
      .map((event) => ({
        params: {
          fullPath: `${
            event.attributes?.locale === 'sk' ? '/zazite/podujatia/' : '/experience/events/'
          }${event.attributes?.slug!}`
            .split('/')
            .slice(1),
          locale: event.attributes?.locale || '',
        },
      }))
  }

  // eslint-disable-next-line no-console
  console.log(`GENERATED STATIC PATHS FOR ${paths.length} SLUGS`)
  return { paths, fallback: 'blocking' }
}

// TODO define type of fullPath to string[]
export const getStaticProps: GetStaticProps<IPageProps> = async (ctx) => {
  const locale = ctx.locale ?? 'sk'
  const slug = last(ctx?.params?.fullPath)

  if (!slug) return { notFound: true } as const

  // eslint-disable-next-line no-console
  console.log(`Revalidating ${locale} event ${slug} on ${ctx?.params?.fullPath}`)

  const translations = (await serverSideTranslations(locale, [
    'common',
    'forms',
    'newsletter',
    'homepage',
  ])) as any

  try {
    const [{ events }, general] = await Promise.all([
      client.EventBySlug({
        slug,
        locale,
      }),
      generalFetcher(locale),
    ])

    const event = events?.data[0] ?? null

    if (!event) return { notFound: true } as const

    return {
      props: {
        slug,
        event,
        locale,
        general,
        ...translations,
      },
      revalidate: 10,
    }
  } catch (iError) {
    console.error(iError)
    const error = getError(iError)

    return {
      props: {
        error,
        ...translations,
      },
      revalidate: 10,
    }
  }
}

export default EventSlugPage
