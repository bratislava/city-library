import { BlogPostEntity, ComponentSeoSeo } from '@bratislava/strapi-sdk-city-library'
import { PageTitle, SectionContainer, Video } from '@bratislava/ui-city-library'
import Breadcrumbs from '@components/Molecules/Breadcrumbs'
import { useTranslation } from 'next-i18next'

import { formatDateToLocal } from '../../utils/utils'
import { usePageWrapperContext } from '../layouts/PageWrapper'
import Sections from '../Molecules/Sections'

export interface BlogPostPageProps {
  blogPost: BlogPostEntity
  Seo?: ComponentSeoSeo
}

const BlogPostPage = ({ blogPost }: BlogPostPageProps) => {
  const { t, i18n } = useTranslation('common')
  const { locale } = usePageWrapperContext()
  const mediaType = blogPost?.attributes?.coverMedia?.data?.attributes?.mime?.split('/')[0] ?? ''

  const breadCrumbs =
    i18n.language === 'sk'
      ? [
          { title: '', url: '/' },
          { title: 'Služby', url: '/sluzby' },
          { title: 'Vzdelávanie', url: '/sluzby/vzdelavanie' },
          { title: 'Články', url: '/sluzby/vzdelavanie/clanky' },
          {
            title: blogPost.attributes?.title || '',
            url: `/sluzby/vzdelavanie/clanky/${blogPost.attributes?.slug ?? ''}`,
          },
        ]
      : [
          { title: '', url: '/' },
          { title: 'Services', url: '/services' },
          { title: 'Education', url: '/services/education' },
          { title: 'Articles', url: '/services/education/articles' },
          {
            title: blogPost.attributes?.title || '',
            url: `/services/education/articles/${blogPost.attributes?.slug ?? ''}`,
          },
        ]

  return (
    <>
      <SectionContainer>
        <Breadcrumbs crumbs={breadCrumbs} />
      </SectionContainer>
      <SectionContainer>
        <PageTitle title={blogPost?.attributes?.title ?? ''} hasDivider={false} />
        <div className="mt-2 text-base text-foreground-body lg:mt-4">{`${t(
          'added'
        )} ${formatDateToLocal(blogPost?.attributes?.publishedAt, locale)}`}</div>

        <div className="-mx-7.5 mt-6 flex md:mx-0 lg:mt-10">
          {blogPost?.attributes?.coverMedia && mediaType === 'image' && (
            <img
              src={blogPost?.attributes?.coverMedia?.data?.attributes?.url ?? ''}
              alt={blogPost?.attributes?.title || ''}
              className="w-full object-cover object-center md:h-[300px] lg:h-[400px]"
            />
          )}
          {blogPost?.attributes?.coverMedia && mediaType === 'video' && (
            <div className="flex w-full justify-center">
              <Video mediaUrl={blogPost?.attributes?.coverMedia?.data?.attributes?.url} />
            </div>
          )}
        </div>

        {/* Sections */}
        <div className="flex">
          <div className="mt-10 w-full lg:mx-auto lg:w-8/12">
            {blogPost?.attributes?.sections && (
              <Sections sections={blogPost?.attributes?.sections} />
            )}
          </div>
        </div>
      </SectionContainer>
    </>
  )
}

export default BlogPostPage
