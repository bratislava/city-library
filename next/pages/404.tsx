import DefaultPageLayout from '@components/layouts/DefaultPageLayout'
import Button from '@modules/common/Button'
import { GeneralQuery } from '@services/graphql'
import { generalFetcher } from '@services/graphql/fetchers/general.fetcher'
import { GeneralContextProvider } from '@utils/generalContext'
import { GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import PageWrapper from '../components/layouts/PageWrapper'
import ErrorPage from '../components/pages/ErrorPage'
import { navikronosGetStaticProps } from '../navikronos/navikronosGetStaticProps'
import { CLNavikronosPageProps, navikronosConfig } from '@utils/navikronos'
import { wrapNavikronosProvider } from '../navikronos/wrapNavikronosProvider'

type Error404PageProps = {
  general: GeneralQuery
} & CLNavikronosPageProps

const Custom404 = ({ general }: Error404PageProps) => {
  const { t } = useTranslation()

  const { asPath, locale } = useRouter()

  return (
    <GeneralContextProvider general={general}>
      <PageWrapper slug="/404">
        <DefaultPageLayout>
          <ErrorPage code={404}>
            <header className="mb-6 text-h1">
              <h1>{t('pageNotFound')}</h1>
            </header>
            <p className="text-base">{t('pageNotFoundSorry')}</p>
            <p className="pt-10 text-base underline">
              {`https://www.mestskakniznica.sk/${locale ?? ''}${asPath}`}
            </p>
            <Button variant="primary" href="/" className="mt-8">
              {t('homepage')}
            </Button>
          </ErrorPage>
        </DefaultPageLayout>
      </PageWrapper>
    </GeneralContextProvider>
  )
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const locale = ctx.locale ?? 'sk'

  const [general, translations, navikronosStaticProps] = await Promise.all([
    generalFetcher(locale),
    serverSideTranslations(locale, ['common', 'forms', 'newsletter']),
    await navikronosGetStaticProps(navikronosConfig, ctx),
  ])

  return {
    props: {
      general,
      navikronosStaticProps,
      ...translations,
    },
  }
}

export default wrapNavikronosProvider(Custom404)
