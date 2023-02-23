import { ArticleCard, Pagination } from '@components/ui'
import {
  blogPostsDefaultFilters,
  blogPostsFetcher,
  getBlogPostsQueryKey,
} from '@services/graphql/fetchers/blog-posts.fetcher'
import { useNavikronos } from '@utils/navikronos'
import { useRoutePreservedState } from '@utils/useRoutePreservedState'
import { useTranslation } from 'next-i18next'
import React from 'react'
import { useQuery } from 'react-query'

const BlogPostsListingSection = () => {
  const { t, i18n } = useTranslation('common')
  const [filters, setFilters] = useRoutePreservedState(blogPostsDefaultFilters)

  const { getPathForEntity } = useNavikronos()

  const { data } = useQuery({
    queryKey: getBlogPostsQueryKey(i18n.language, filters),
    queryFn: () => blogPostsFetcher(i18n.language, filters),
    keepPreviousData: true,
  })

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page })
  }

  if (!data) {
    return null
  }

  // TODO: Advanced data fetching
  return (
    <>
      {data.blogPosts?.data?.length ? (
        <div className="mt-8 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-5 md:grid-cols-3 md:gap-y-10 lg:grid-cols-4">
          {data.blogPosts.data.map((blogPost) => (
            <div key={blogPost.attributes?.slug}>
              <ArticleCard
                title={blogPost?.attributes?.title}
                media={blogPost?.attributes?.coverMedia?.data?.attributes?.url || ''}
                mediaType={
                  blogPost?.attributes?.coverMedia?.data?.attributes?.mime?.split('/')[0] ?? ''
                }
                publishedDate={blogPost?.attributes?.publishedAt}
                pageLink={{
                  title: t('showMore'),
                  url:
                    getPathForEntity({ type: 'blog-post', slug: blogPost?.attributes?.slug }) ?? '',
                }}
              />
            </div>
          ))}
        </div>
      ) : null}
      {data.blogPosts?.meta?.pagination?.total && (
        <div className="mt-4 flex justify-end">
          <Pagination
            max={Math.ceil(data.blogPosts?.meta.pagination.total / filters.pageSize)}
            value={filters.page}
            onChangeNumber={handlePageChange}
          />
        </div>
      )}
    </>
  )
}

export default BlogPostsListingSection
