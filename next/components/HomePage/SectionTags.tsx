import { BookTagsQuery } from '@bratislava/strapi-sdk-city-library'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import { useEffect, useState } from 'react'

interface BookTagsProps {
  bookTags: NonNullable<BookTagsQuery['bookTags']>
}

function BooksTags({ bookTags }: BookTagsProps) {
  const { t } = useTranslation('homepage')
  return (
    <>
      <h2 className="object-none text-center pt-10 text-lg">{t('lookingForBook')}</h2>
      <section className="object-center">
        <div className="pt-8 pb-8 text-center items-center flex flex-col flex-grow-0">
          <div className="flex flex-row my-2 mx-0 flex-grow-0 flex-wrap gap-4 justify-center jus">
            {bookTags?.data?.map((tag) => (
                <a
                  href={`https://opac.mestskakniznica.sk/opac?fn=searchform&extSrchTitle=${tag?.attributes?.slug}`}
                  target="_blank"
                  className="border h-9 border-gray-400 hover:border-gray-900 rounded-full py-2 px-4 text-xs whitespace-nowrap"
                  rel="noreferrer"
                  key={tag?.attributes?.slug}
                >
                  {tag?.attributes?.displayName}
                </a>
              ))}
          </div>
        </div>
        <div className="text-sm pb-8 text-center hover:underline">
          <a target="_blank" href="https://opac.mestskakniznica.sk/opac?fn=searchform&extSrchTitle" rel="noreferrer">
            {t('lookingForBookSearch')} {'>'}
          </a>
        </div>
      </section>
    </>
  )
}
export default BooksTags
