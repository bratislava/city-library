import {
  Enum_Page_Layout,
  EventCardEntityFragment,
  EventCategoryEntity,
  EventEntityFragment,
  EventLocalityEntity,
  EventTagEntity,
  FooterEntity,
  MenuEntity,
  PageEntity,
  PageEntityFragment,
  Pagination,
  PartnerEntity,
  PartnerEntityFragment,
  PremiseEntity,
} from '../graphql'
import { GetStaticPaths, GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { ReactNode } from 'react'
import DefaultPageLayout from '../components/layouts/DefaultPageLayout'
import PageWrapper from '../components/layouts/PageWrapper'
import ErrorDisplay, { getError, IDisplayError } from '../components/Molecules/ErrorDisplay'
import BlogPostsPage from '../components/pages/blogPostsPage'
import BookNewsPage from '../components/pages/bookNewsPage'
import DocumentsPage from '../components/pages/DocumentsPage'
import ErrorPage from '../components/pages/ErrorPage'
import EventPage from '../components/pages/eventPage'
import EventsListingPage from '../components/pages/eventsListingPage'
import FullContentPage from '../components/pages/fullContentPage'
import ListingPage from '../components/pages/listingPage'
import LocalitiesListingPage from '../components/pages/localitiesListingPage'
import LocalityPage from '../components/pages/localityPage'
import NewsListingPage from '../components/pages/newsListingPage'
import PartnersPage from '../components/pages/partnersPage'
import Premises from '../components/pages/premises'
import SidebarContentPage from '../components/pages/sidebarContentPage'
import SublistingPage from '../components/pages/sublistingPage'
import { client } from '../utils/gql'
import { isDefined } from '../utils/isDefined'
import { getOpacBooks, OpacBook } from '../utils/opac'
import { sortPartners } from '../utils/page'
import { ILocality } from '../utils/types'
import {
  arrayify,
  convertPagesToLocalities,
  isPresent,
  shouldSkipStaticPaths,
} from '../utils/utils'

interface IPageProps {
  error?: IDisplayError
  slug: string
  page: PageEntity
  partners: PartnerEntity[]
  promotedEvents: EventCardEntityFragment[]
  eventDetail: EventEntityFragment
  allEvents: EventCardEntityFragment[]
  eventListEvents: EventCardEntityFragment[]
  upcomingEventListEvents: EventCardEntityFragment[]
  latestEvents: EventCardEntityFragment[]
  premises: PremiseEntity[]
  opacBookNews: OpacBook[]
  localities: ILocality[]
  news: PageEntity[]
  locale?: string
  eventCategories: EventCategoryEntity[]
  eventTags: EventTagEntity[]
  eventLocalities: EventLocalityEntity[]
  allNewsLink: string
  menus: MenuEntity[]
  footer: FooterEntity
  paginationFields: Pagination
  upcomingPaginationFields: Pagination
}

function Page({
  error,
  page,
  partners,
  promotedEvents,
  eventDetail,
  allEvents,
  eventListEvents,
  upcomingEventListEvents,
  latestEvents,
  opacBookNews,
  premises,
  localities,
  news,
  locale,
  paginationFields,
  upcomingPaginationFields,
  eventCategories,
  eventTags,
  eventLocalities,
  allNewsLink,
  menus,
  footer,
}: IPageProps) {
  if (error) {
    return (
      <ErrorPage code={500}>
        <ErrorDisplay error={error} />
      </ErrorPage>
    )
  }

  const sortedPartners = sortPartners(partners)

  let pageComponentByLayout: ReactNode = null

  switch (page?.attributes?.layout) {
    case Enum_Page_Layout.Listing:
      pageComponentByLayout = <ListingPage allEvents={allEvents} page={page} news={news} />
      break

    case Enum_Page_Layout.Sublisting:
      pageComponentByLayout = <SublistingPage page={page} />
      break

    case Enum_Page_Layout.News:
    case Enum_Page_Layout.FullContent:
      pageComponentByLayout = <FullContentPage page={page} />
      break

    case Enum_Page_Layout.ContentWithSidebar:
      pageComponentByLayout = <SidebarContentPage page={page} />
      break

    case Enum_Page_Layout.Partners:
      pageComponentByLayout = <PartnersPage page={page} partners={sortedPartners} />
      break

    case Enum_Page_Layout.BlogPosts:
      pageComponentByLayout = <BlogPostsPage page={page} />
      break

    case Enum_Page_Layout.Documents:
      pageComponentByLayout = <DocumentsPage page={page} />
      break

    case Enum_Page_Layout.EventsListing:
      pageComponentByLayout = (
        <EventsListingPage
          page={page}
          promotedEvents={promotedEvents}
          events={eventListEvents}
          futureEvents={upcomingEventListEvents}
          eventCategories={eventCategories}
          eventTags={eventTags}
          eventLocalities={eventLocalities}
          paginationFields={paginationFields}
          upcomingPaginationFields={upcomingPaginationFields}
        />
      )
      break

    case Enum_Page_Layout.Premises:
      pageComponentByLayout = <Premises page={page} premises={premises} />
      break

    case Enum_Page_Layout.LocalitiesListing:
      pageComponentByLayout = <LocalitiesListingPage page={page} localities={localities} />
      break

    case Enum_Page_Layout.NewsListing:
      pageComponentByLayout = (
        <NewsListingPage
          page={page}
          news={news as PageEntityFragment[]}
          pagination={paginationFields}
        />
      )
      break

    case Enum_Page_Layout.Locality:
      pageComponentByLayout = (
        <LocalityPage page={page} events={allEvents} eventsListingUrl={allNewsLink} />
      )
      break

    case Enum_Page_Layout.BookNews:
      pageComponentByLayout = <BookNewsPage books={opacBookNews} page={page} />
      break
  }

  if (!pageComponentByLayout && eventDetail) {
    pageComponentByLayout = (
      <EventPage event={eventDetail} locale={locale} events={[]} allNewsLink={''} />
    )
  }

  return (
    <PageWrapper
      locale={page?.attributes?.locale ?? ''}
      slug={page?.attributes?.slug ?? ''}
      localizations={page?.attributes?.localizations?.data
        .filter(isPresent)
        .map((localisation) => ({
          locale: localisation.attributes?.locale,
          slug: localisation.attributes?.slug,
        }))}
    >
      <DefaultPageLayout
        title={page?.attributes?.title}
        Seo={page?.attributes?.Seo}
        menus={menus}
        footer={footer}
        latestEvents={latestEvents}
      >
        {pageComponentByLayout}
      </DefaultPageLayout>
    </PageWrapper>
  )
}

export const getStaticPaths: GetStaticPaths = async ({ locales = ['sk', 'en'] }) => {
  let paths: any = []
  if (shouldSkipStaticPaths()) return { paths, fallback: 'blocking' }

  const pathArraysForLocales = await Promise.all(
    locales.map((locale) => client.PagesStaticPaths({ locale }))
  )
  const pages = pathArraysForLocales.flatMap(({ pages }) => pages?.data || []).filter(isDefined)
  if (pages.length > 0) {
    paths = pages
      .filter((page) => page.attributes?.slug)
      .map((page) => ({
        params: {
          slug: page?.attributes?.slug ? page.attributes?.slug.split('/') : [],
          locale: page?.attributes?.locale || '',
        },
      }))
  }

  console.log(`GENERATED STATIC PATHS FOR ${paths.length} SLUGS`)
  return { paths, fallback: 'blocking' }
}

export const getStaticProps: GetStaticProps<IPageProps> = async (ctx) => {
  const locale = ctx.locale ?? 'sk'
  const slug = arrayify(ctx?.params?.slug).join('/')

  console.log(`Static gen: ${locale} ${slug}`)
  const translations = (await serverSideTranslations(locale, [
    'common',
    'forms',
    'newsletter',
    'homepage',
  ])) as any

  try {
    const promotedEvents: EventCardEntityFragment[] = []
    let allEvents: EventCardEntityFragment[] = []
    let eventListEvents: EventCardEntityFragment[] = []
    let upcomingEventListEvents: EventCardEntityFragment[] = []
    let news: PageEntityFragment[] = []
    let latestEvents: EventCardEntityFragment[] = []
    let premises: PremiseEntity[] = []
    let localities: ILocality[] = []
    let eventCategories: EventCategoryEntity[] = []
    let eventTags: EventTagEntity[] = []
    let eventLocalities: EventLocalityEntity[] = []
    let opacBookNews: OpacBook[] = []
    let allNewsLink = ''
    let paginationFields: Pagination | null = null
    let upcomingPaginationFields: Pagination | null = null

    const queryResponse = await client.PageBySlug({
      slug,
      locale,
    })
    // menus, footer
    const pageBySlug = queryResponse?.pages?.data[0]
    let eventDetail: EventEntityFragment | null = null
    const { menus, footer } = queryResponse

    if (!pageBySlug) {
      const { events: eventResponse } = await client.EventBySlug({ slug })
      if (eventResponse?.data[0]) {
        eventDetail = eventResponse.data[0]
      } else {
        return { notFound: true } as { notFound: true }
      }
    }

    // For all page in header
    let allEventPages: EventCardEntityFragment[] = []
    const today = new Date()
    const futureEvents = await client.EventList({
      locale,
      start: 0,
      limit: 10,
      filters: { dateFrom: { gte: today.toISOString() } },
      sort: 'dateFrom:asc',
    })
    allEventPages = futureEvents.events?.data || []
    latestEvents = futureEvents.events?.data.slice(0, 4) || []

    // all partners for about us partners page
    const partners: { allPartners: PartnerEntityFragment[] | null } = {
      allPartners: null,
    }

    if (pageBySlug && pageBySlug?.attributes?.layout === 'partners') {
      const partnerResponse = await client.AllPartners({ locale })
      partners.allPartners = partnerResponse.partners?.data || null
    }

    if (pageBySlug?.attributes?.layout === Enum_Page_Layout.BookNews) {
      opacBookNews = (await getOpacBooks()) || []
    }

    if (pageBySlug?.attributes?.layout === Enum_Page_Layout.EventsListing) {
      const [{ promotedEvents }, eventProperties] = await Promise.all([
        client.PromotedEvents({ locale, start: 0, limit: 4 }),
        client.EventProperties({ locale }),
      ])

      const today = new Date();
      const PAGE_SIZE = 8;

      const eventPages = await client.EventList({
        locale,
        start: 0,
        limit: PAGE_SIZE,
        filters: {'dateFrom': {'lt': today.toISOString()}},
        sort: 'dateFrom:desc',
      })

      const upcomingEventPages = await client.EventList({
        locale,
        start: 0,
        limit: PAGE_SIZE,
        filters: {'dateFrom': {'gte': today.toISOString()}},
        sort: 'dateFrom:asc',
      })

      eventListEvents = eventPages.events?.data || []
      paginationFields = eventPages.events?.meta.pagination || null
      upcomingEventListEvents = upcomingEventPages.events?.data || []
      upcomingPaginationFields = upcomingEventPages.events?.meta.pagination || null

      eventCategories = eventProperties.eventCategories?.data || []
      eventTags = eventProperties.eventTags?.data || []
      eventLocalities = eventProperties.eventLocalities?.data || []
    }
    if (
      pageBySlug?.attributes?.layout === Enum_Page_Layout.Event ||
      pageBySlug?.attributes?.layout === Enum_Page_Layout.Locality ||
      pageBySlug?.attributes?.layout === Enum_Page_Layout.Listing
    ) {
      allEvents = allEventPages

      const { pages } = await client.PagesByLayout({
        layout: 'eventsListing',
        locale,
      })
      allNewsLink = pages && pages.data[0]?.attributes?.slug ? pages.data[0]?.attributes?.slug : ''
    }

    if (
      pageBySlug?.attributes?.layout === Enum_Page_Layout.NewsListing ||
      pageBySlug?.attributes?.layout === Enum_Page_Layout.Listing
    ) {
      const newsPages = await client.PagesByLayoutPaginated({
        layout: 'news',
        locale,
        sort: 'createdAt:desc',
      })
      news = newsPages?.pages?.data ?? []
      paginationFields = newsPages?.pages?.meta?.pagination || null
    }

    if (pageBySlug?.attributes?.layout === Enum_Page_Layout.Premises) {
      const premisesPages: any = await client.Premises({ locale })
      premises = premisesPages?.premises?.data
    }

    if (pageBySlug?.attributes?.layout === Enum_Page_Layout.LocalitiesListing) {
      const localitiesPages = await client.PagesByLayout({
        layout: 'locality',
        locale,
        sort: 'publishedAt:desc',
      })
      localities = convertPagesToLocalities(localitiesPages?.pages?.data ?? [], true) || []
    }

    return {
      props: {
        slug,
        page: pageBySlug || null,
        partners: partners.allPartners ?? [],
        eventDetail,
        promotedEvents,
        allEvents,
        eventListEvents,
        upcomingEventListEvents,
        latestEvents,
        allNewsLink,
        opacBookNews,
        eventCategories,
        eventTags,
        eventLocalities,
        premises,
        localities,
        news,
        locale,
        paginationFields,
        upcomingPaginationFields,
        menus: menus?.data ?? [],
        footer: footer?.data,
        ...translations,
      },
      revalidate: 86400,
    }
  } catch (iError) {
    console.error(iError)
    const error = getError(iError)

    return {
      props: {
        error,
        ...translations,
      },
      revalidate: 86400,
    }
  }
}

export default Page
