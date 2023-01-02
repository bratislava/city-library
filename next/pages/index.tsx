import { Localities, SectionContainer } from '@bratislava/ui-city-library'
import { client } from '@utils/gql'
import { hasAttributes, isDefined } from '@utils/isDefined'
import { getOpacBooks, OpacBook } from '@utils/opac'
import { isPresent } from '@utils/utils'
import { GetStaticProps } from 'next'
import { useTranslation } from 'next-i18next'
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
import {
  BookTagEntityFragment,
  ComponentHomepageFaqSection,
  ComponentHomepageNewsSection,
  ComponentHomepageRegistrationInfo,
  ComponentSectionsMap,
  ComponentSeoSeo,
  EventCardEntityFragment,
  FooterEntity,
  MenuEntity,
  PageEntity,
  PageEntityFragment,
  PageLocalizationEntityFragment,
  PromoNewsCardFragment,
} from '../graphql'
// used for example meili usage
// import { useUpcomingEvents } from '../hooks/useUpcomingEvets'
// import { useEffect } from 'react'
// import { meiliClient } from '@utils/meilisearch'

interface IIndexProps {
  locale?: string
  localizations?: PageLocalizationEntityFragment[]
  menus: MenuEntity[]
  upcomingEvents: EventCardEntityFragment[]
  promos: (EventCardEntityFragment | PromoNewsCardFragment)[]
  news: PageEntity[]
  opacBookNews: OpacBook[]
  faqSection: ComponentHomepageFaqSection
  newsSection: ComponentHomepageNewsSection
  registrationInfoSection: ComponentHomepageRegistrationInfo
  bookTags: BookTagEntityFragment[]
  mapSection: ComponentSectionsMap
  footer: FooterEntity
  error?: IDisplayError
  Seo?: ComponentSeoSeo
}

export const Index = ({
  locale = 'sk',
  localizations,
  menus,
  upcomingEvents,
  promos,
  news,
  opacBookNews,
  faqSection,
  newsSection,
  registrationInfoSection,
  bookTags,
  mapSection,
  footer,
  error,
  Seo,
}: IIndexProps) => {
  const { t } = useTranslation('common')

  // example of how to search in hooked events with meilisearch
  // useEffect(() => {
  //   meiliClient
  //     .index('event')
  //     .search('eve', {
  //       limit: 10,
  //       filter: [`locale = ${locale}`],
  //     })
  //     .then(console.log)
  // }, [locale])

  if (error) {
    return (
      <PageWrapper
        locale={locale}
        slug="/"
        localizations={localizations?.filter(isPresent).map((localization) => ({
          locale: localization.attributes?.locale,
          slug: localization.attributes?.slug,
        }))}
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
        .map((l) => ({ ...l, slug: '' }))}
    >
      <DefaultPageLayout Seo={Seo} menus={menus} footer={footer} upcomingEvents={upcomingEvents}>
        <h1 className="sr-only">{t('pageTitle')}</h1>
        {promos.length > 0 && (
          <SectionContainer>
            <Section>
              <SectionPromos promos={promos} />
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
              <SectionLibraryNews newsSection={newsSection} news={news as PageEntityFragment[]} />
            </Section>
          </SectionContainer>
        )}

        {bookTags && bookTags.length > 0 && (
          <SectionContainer>
            <Section>
              <SectionTags bookTags={bookTags} />
            </Section>
          </SectionContainer>
        )}

        <SectionContainer>
          <Section noBorder>
            <Localities
              mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_PUBLIC_KEY || ''}
              branches={
                mapSection.branches?.map((branch) => branch?.branch?.data).filter(isDefined) ?? []
              }
            />
          </Section>
        </SectionContainer>
      </DefaultPageLayout>
    </PageWrapper>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale = 'sk' }) => {
  const translations = await serverSideTranslations(locale, ['common', 'newsletter', 'homepage'])

  try {
    // running all requests parallel
    // TODO rewrite this into a single gql query for homepage - beforehand filter needless data that isn't used
    const [
      opacBookNews,
      {
        homePage,
        menus,
        upcomingEvents,
        promotedNews,
        promotedEvents,
        latestNews,
        bookTags,
        footer,
      },
    ] = await Promise.all([
      getOpacBooks(),
      client.HomePage({ locale, date: new Date().toISOString() }),
    ])

    if (!homePage) {
      return { notFound: true }
    }

    // const localities = convertPagesToLocalities(localityPages?.data ?? [], true).map(
    //   (locality) => ({
    //     ...locality,
    //     hideOpeningHours: true,
    //   })
    // )

    return {
      props: {
        locale,
        localizations: homePage?.data?.attributes?.localizations?.data ?? null,
        menus: menus?.data,
        upcomingEvents: upcomingEvents?.data ?? [],
        promos: [...(promotedNews?.data ?? []), ...(promotedEvents?.data ?? [])],
        news: latestNews?.data?.filter(hasAttributes) ?? [],
        opacBookNews,
        faqSection: homePage?.data?.attributes?.faqSection ?? null,
        newsSection: homePage?.data?.attributes?.newsSection ?? null,
        registrationInfoSection: homePage?.data?.attributes?.registrationInfoSection ?? null,
        bookTags: bookTags?.data?.filter(hasAttributes) ?? [],
        mapSection: homePage?.data?.attributes?.mapSection ?? null,
        footer: footer?.data,
        Seo: homePage?.data?.attributes?.Seo ?? null,
        ...translations,
      },
      revalidate: 3600, // revalidates every hour
    }
  } catch (iError) {
    console.error(iError)
    const error = getError(iError)

    return {
      props: {
        error,
        ...translations,
      },
      revalidate: 180, // in case of an error, revalidates in 3 minutes
    }
  }
}

export default Index
