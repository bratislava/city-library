import { SectionContainer } from '@components/ui'
import BookCard, { Book } from '@modules/cards-and-rows/BookCard'
import ShowMoreLink from '@modules/common/ShowMoreLink'
import { useGeneralContext } from '@utils/generalContext'
import { useNavikronos } from '@utils/navikronos'
import { useTranslation } from 'next-i18next'
import React from 'react'

type SectionHomepageNewBooksProps = { books: Book[] }

const SectionHomepageNewBooks = ({ books }: SectionHomepageNewBooksProps) => {
  const { t } = useTranslation('homepage')
  const { general } = useGeneralContext()
  const { getPathForStrapiEntity } = useNavikronos()

  return (
    <SectionContainer hasBorder>
      <section className="relative flex w-full flex-col py-10">
        <h2 className="text-center text-h3 md:text-left">{t('newBooksTitle')}</h2>

        <div className="flex gap-x-4 py-6 xl:grid xl:grid-cols-6">
          {books.map((book) => (
            <div key={book.url} className="shrink-0">
              <BookCard book={book} />
            </div>
          ))}
        </div>

        <div className="top-12 right-0 flex justify-center pt-1 md:absolute md:w-fit">
          <ShowMoreLink
            href={getPathForStrapiEntity(general?.data?.attributes?.newBooksPage?.data) ?? '#'}
          >
            {t('newBooksAll')}
          </ShowMoreLink>
        </div>
      </section>
    </SectionContainer>
  )
}

export default SectionHomepageNewBooks
