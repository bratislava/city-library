import { BlogPostEntity, ComponentSeoSeo } from '@bratislava/strapi-sdk-city-library'
import { PageTitle, SectionContainer, Video } from '@bratislava/ui-city-library'
import FormatDate from '@modules/common/FormatDate'
import { useTranslation } from 'next-i18next'

import PageBreadcrumbs from '../Molecules/PageBreadcrumbs'
import Sections from '../Molecules/Sections'

export interface BlogPostPageProps {
  blogPost: BlogPostEntity
  Seo?: ComponentSeoSeo
}

const BlogPostPage = ({ blogPost }: BlogPostPageProps) => {
  const { t } = useTranslation('common')
  const mediaType = blogPost?.attributes?.coverMedia?.data?.attributes?.mime?.split('/')[0] ?? ''

  return (
    <SectionContainer>
      {blogPost?.attributes?.parentPage && (
        <PageBreadcrumbs page={blogPost?.attributes?.parentPage?.data} blogPost={blogPost} />
      )}

      <PageTitle title={blogPost?.attributes?.title ?? ''} hasDivider={false} />
      <div className="mt-2 text-base text-foreground-body lg:mt-4">
        {t('added')} <FormatDate valueType="ISO" value={blogPost?.attributes?.publishedAt} />
      </div>

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
          {blogPost?.attributes?.sections && <Sections sections={blogPost?.attributes?.sections} />}
        </div>
      </div>
    </SectionContainer>
  )
}

export default BlogPostPage
