import BranchPage from '@components/pages/BranchPage'
import { BranchEntityFragment, GeneralQuery } from '@services/graphql'
import { generalFetcher } from '@services/graphql/fetchers/general.fetcher'
import { client } from '@services/graphql/gql'
import { GeneralContextProvider } from '@utils/generalContext'
import { isDefined } from '@utils/isDefined'
import { isPresent } from '@utils/utils'
import last from 'lodash/last'
import { GetStaticPaths, GetStaticPathsResult, GetStaticProps } from 'next'
import { SSRConfig, useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { ParsedUrlQuery } from 'node:querystring'

import DefaultPageLayout from '../../components/layouts/DefaultPageLayout'
import PageWrapper from '../../components/layouts/PageWrapper'

type PageProps = {
  branch: BranchEntityFragment
  general: GeneralQuery
} & SSRConfig

const EventSlugPage = ({ branch, general }: PageProps) => {
  const { t } = useTranslation(['common'])

  return (
    <GeneralContextProvider general={general}>
      <PageWrapper
        locale={branch.attributes?.locale ?? ''}
        slug={`${t('branch_slug')}${branch.attributes?.slug}`}
        localizations={branch.attributes?.localizations?.data
          .filter(isPresent)
          .map((localization) => ({
            locale: localization.attributes?.locale,
            // TODO locale is switched on purpose to get en url if user is on sk page and vice versa
            slug: `${
              branch.attributes?.locale === 'en'
                ? '/navstivte/nase-lokality/'
                : '/visit/our-locations/'
            }${localization.attributes?.slug}`,
          }))}
      >
        <DefaultPageLayout title={branch.attributes?.title} seo={branch.attributes?.seo}>
          <BranchPage branch={branch} />
        </DefaultPageLayout>
      </PageWrapper>
    </GeneralContextProvider>
  )
}

// TODO use common functions to prevent duplicate code
interface StaticParams extends ParsedUrlQuery {
  fullPath: string[]
}

export const getStaticPaths: GetStaticPaths<StaticParams> = async ({ locales = ['sk', 'en'] }) => {
  let paths: GetStaticPathsResult<StaticParams>['paths'] = []

  const pathArraysForLocales = await Promise.all(
    locales.map((locale) => client.BranchStaticPaths({ locale }))
  )
  const entities = pathArraysForLocales
    .flatMap(({ branches }) => branches?.data || [])
    .filter(isDefined)

  if (entities.length > 0) {
    paths = entities
      .filter((entity) => entity.attributes?.slug)
      .map((entity) => ({
        params: {
          fullPath: `${entity.attributes?.locale === 'sk' ? '/navstivte/' : '/visit/'}${entity
            .attributes?.slug!}`
            .split('/')
            .slice(1),
          locale: entity.attributes?.locale || '',
        },
      }))
  }

  // eslint-disable-next-line no-console
  console.log(`Branches: Generated static paths for ${paths.length} slugs.`)

  return { paths, fallback: 'blocking' }
}

// TODO define type of fullPath to string[]
export const getStaticProps: GetStaticProps<PageProps, StaticParams> = async ({
  locale = 'sk',
  params,
}) => {
  const slug = last(params?.fullPath)

  if (!slug) return { notFound: true } as const

  // eslint-disable-next-line no-console
  console.log(`Revalidating ${locale} branch ${slug} on ${params?.fullPath.join('/') ?? ''}`)

  const [{ branches }, general, translations] = await Promise.all([
    client.BranchBySlug({
      slug,
      locale,
    }),
    generalFetcher(locale),
    serverSideTranslations(locale, ['common', 'forms', 'newsletter']),
  ])

  const branch = branches?.data[0] ?? null

  if (!branch) return { notFound: true } as const

  return {
    props: {
      slug,
      branch,
      general,
      ...translations,
    },
    revalidate: 10,
  }
}

export default EventSlugPage
