import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import PageWrapper from '../../components/layouts/PageWrapper'
import FileDetailPage from '../../components/pages/fileDetailPage'
import { BasicDocumentEntity, FooterQuery, MenuEntity } from '../../graphql'
import { client } from '../../utils/gql'
import { arrayify } from '../../utils/utils'

interface IFilePageProps {
  basicDocument: BasicDocumentEntity
  locale: string
  slug: string
  menus: MenuEntity[]
  footer: FooterQuery['footer']
}

function Page({ basicDocument, locale, menus, footer, slug }: IFilePageProps) {
  return (
    <PageWrapper locale={locale ?? 'sk'} slug={slug}>
      <FileDetailPage locale={locale} file={basicDocument} menus={menus} footer={footer?.data || {}} />
    </PageWrapper>
  )
}

export const getServerSideProps: GetServerSideProps<IFilePageProps> = async ({ locale = 'sk', query }) => {
  const slug = arrayify(query.slug)[0]

  if (!slug) return { notFound: true }

  const basicDocumentBySlug = await client.BasicDocumentBySlug({ slug })
  const { menus } = await client.Menus({ locale })
  const { footer } = await client.Footer({ locale })
  const translations = (await serverSideTranslations(locale, ['common', 'newsletter'])) as any

  if (!basicDocumentBySlug.basicDocuments?.data && !menus) return { notFound: true }

  return {
    props: {
      slug,
      locale,
      menus: menus?.data,
      footer: footer?.data,
      basicDocument: basicDocumentBySlug.basicDocuments?.data[0],
      ...translations,
    },
  }
}

export default Page
