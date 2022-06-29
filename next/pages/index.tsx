import {
  BookTagsQuery,
  FooterQuery,
  HomePageQuery,
  MenusQuery
} from '@bratislava/strapi-sdk-city-library'
import { Localities, SectionContainer } from '@bratislava/ui-city-library'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Section from '../components/AppLayout/Section'
import SectionFaq from '../components/HomePage/SectionFaq'
import SectionLibraryNews from '../components/HomePage/SectionLibraryNews'
import SectionOpacBookNews from '../components/HomePage/SectionOpacBookNews'
import SectionPromos from '../components/HomePage/SectionPromos'
import SectionRegistrationInfo from '../components/HomePage/SectionRegistrationInfo'
import SectionTags from '../components/HomePage/SectionTags'
import DefaultPageLayout from '../components/layouts/DefaultPageLayout'
import PageWrapper from '../components/layouts/PageWrapper'
import ErrorDisplay, { getError, IDisplayError } from '../components/Molecules/ErrorDisplay'
import ErrorPage from '../components/pages/ErrorPage'
import { client } from '../utils/gql'
import { isDefined } from '../utils/isDefined'
import { getOpacBooks, OpacBook } from '../utils/opac'
import { IEvent, ILocality } from '../utils/types'
import { convertPagesToEvents, convertPagesToLocalities, isPresent } from '../utils/utils'


export function Index({
  locale,
  localizations,
  news,
  latestEvents,
  promotedEvents,
  bookTags,
  faqSection,
  registrationInfoSection,
  newsSection,
  opacBookNews,
  localities,
  error,
  Seo,
  menus,
  footer,
}: IProps) {
  if (error) {
    return (
      <PageWrapper
        locale={locale ?? 'sk'}
        slug="/"
        localizations={localizations
          ?.filter(isPresent)
          // add empty slug because it's expected in wrapper and index page does not have slug
          .map((l: any) => ({ ...l, slug: '' }))}
      >
        <ErrorPage code={500}>
          <ErrorDisplay error={error} />
        </ErrorPage>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper
      locale={locale ?? 'sk'}
      slug="/"
      localizations={localizations
        ?.filter(isPresent)
        // add empty slug because it's expected in wrapper and index page does not have slug
        .map((l: any) => ({ ...l, slug: '' }))}
    >
      <DefaultPageLayout Seo={Seo} menus={menus} footer={footer} latestEvents={latestEvents}>
        {promotedEvents.length > 0 && (
          <SectionContainer>
            <Section>
              <SectionPromos events={promotedEvents} />
            </Section>
          </SectionContainer>
        )}

        <SectionContainer>
          <SectionOpacBookNews books={opacBookNews} />
        </SectionContainer>

        {faqSection !== null && (
          <SectionContainer>
            <Section>
              <SectionFaq faqSection={faqSection} />
            </Section>
          </SectionContainer>
        )}

        {registrationInfoSection !== null && (
          <SectionContainer>
            <Section>
              <SectionRegistrationInfo registrationInfoSection={registrationInfoSection} />
            </Section>
          </SectionContainer>
        )}

        {newsSection !== null && news.length > 0 && (
          <SectionContainer>
            <Section>
              <SectionLibraryNews newsSection={newsSection} news={news} />
            </Section>
          </SectionContainer>
        )}

        <SectionContainer>
          <Section>
            <SectionTags bookTags={bookTags} />
          </Section>
        </SectionContainer>

        <SectionContainer>
          <Section noBorder>
            <Localities
              mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_PUBLIC_KEY || ''}
              localities={localities}
            />
          </Section>
        </SectionContainer>
      </DefaultPageLayout>
    </PageWrapper>
  )
}

interface IProps {
  locale?: string
  localizations?: NonNullable<NonNullable<HomePageQuery['homePage']>['localizations']>
  news: IEvent[]
  latestEvents: IEvent[]
  opacBookNews: OpacBook[]
  promotedEvents: IEvent[]
  bookTags: NonNullable<BookTagsQuery['bookTags']>
  faqSection: NonNullable<NonNullable<HomePageQuery['homePage']>['faqSection']>
  newsSection: NonNullable<NonNullable<HomePageQuery['homePage']>['newsSection']>
  registrationInfoSection: NonNullable<
    NonNullable<HomePageQuery['homePage']>['registrationInfoSection']
  >
  localities: ILocality[]
  error?: IDisplayError
  Seo?: NonNullable<NonNullable<HomePageQuery['homePage']>['Seo']>
  menus: NonNullable<MenusQuery['menus']>
  footer: FooterQuery['footer']
}

// trigger redeployment :)

export const getStaticProps: GetStaticProps = async ({ locale = 'sk' }) => {
  const translations = await serverSideTranslations(locale, ['common', 'newsletter', 'homepage'])

  try {
    // running all requests parallel
    // TODO rewrite this into a single gql query for homepage - beforehand filter needless data that isn't used
    const [
      opacBookNews,
      newsPages,
      { homePage, menus, footer },
      promotedPages,
      localityPages,
      { bookTags },
    ] = await Promise.all([
      getOpacBooks(),
      client.PagesByLayout({
        layout: 'news',
        locale,
      }),
      client.HomePage({ locale }),
      client.PromotedPages({ locale }),
      client.PagesByLayout({
        layout: 'locality',
        locale,
      }),
      client.BookTags(),
    ])

    if (!homePage || !bookTags) {
      return { notFound: true }
    }
    interface eventProps {
      dateTo?: any | null | undefined
      dateFrom?: any | null | undefined
    }

    let allEventPages: any[] = [];
    for (let i = 0; i <= 15; i++) {
      const eventPages = await client.PagesByLayout({
        layout: 'event',
        locale,
        start: i * 250,
        limit: 250,
      });
      const length = eventPages.pages?.length;
      if (!length || length === 0) break;
      allEventPages = allEventPages.concat(eventPages.pages);
    }

    const latestEvents = convertPagesToEvents(allEventPages)
      .filter((event: eventProps) => new Date(event.dateTo) >= new Date())
      .sort((a: eventProps, b: eventProps) => {
        if (new Date(a.dateFrom) < new Date(b.dateFrom)) return 1
        if (new Date(a.dateFrom) > new Date(b.dateFrom)) return -1
        return 0
      })
      .slice(0, 4)

    const news = convertPagesToEvents(newsPages.pages?.filter(isDefined) ?? [])
      .sort((a: eventProps, b: eventProps) => {
        if (new Date(a.dateFrom) < new Date(b.dateFrom)) return 1
        if (new Date(a.dateFrom) > new Date(b.dateFrom)) return -1
        return 0
      })
      .slice(0, 4)
    const promotedEvents = convertPagesToEvents(promotedPages.pages?.filter(isDefined) ?? [])
    const localities = convertPagesToLocalities(
      localityPages.pages?.filter(isDefined) ?? [],
      true
    ).map((locality) => ({
      ...locality,
      hideOpeningHours: true,
    }))

    return {
      props: {
        locale,
        localizations: homePage?.localizations,
        news,
        latestEvents,
        promotedEvents,
        bookTags,
        opacBookNews,
        menus,
        footer,
        faqSection: homePage?.faqSection,
        newsSection: homePage?.newsSection,
        Seo: homePage?.Seo,
        registrationInfoSection: homePage?.registrationInfoSection,
        localities,
        ...translations,
      },
      revalidate: 180,
    }
  } catch (iError) {
    console.error(iError)
    const error = getError(iError)

    return {
      props: {
        error,
        ...translations,
      },
      revalidate: 180,
    }
  }
}

export default Index
