import ChevronRight from '@assets/images/chevron-right.svg'
import { PageEntity } from '@bratislava/strapi-sdk-city-library'
import { Button, PageTitle, Pagination, SectionContainer } from '@bratislava/ui-city-library'
import cx from 'classnames'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import { useCallback, useEffect, useRef, useState } from 'react'

import {
  allSearchTypes,
  commonSearchFetcher,
  CommonSearchFilters,
  CommonSearchType,
  getCommonSearchSwrKey,
} from '../../backend/meili/fetchers/commonSearchFetcher'
import { useSearch } from '../../hooks/useSearch'
import useSwrWithExtras from '../../hooks/useSwrWithExtras'
import { AnimateHeight } from '../Atoms/AnimateHeight'
import SearchField from '../Atoms/SearchField'
import TagToggle from '../Atoms/TagToggle'
import PageBreadcrumbs from '../Molecules/PageBreadcrumbs'

export interface PageProps {
  pageEntity: PageEntity | undefined
}

const SearchPage = ({ pageEntity }: PageProps) => {
  const { t, i18n } = useTranslation('common')

  const resultsRef = useRef<HTMLDivElement>(null)

  const [filters, setFilters] = useState<CommonSearchFilters>({
    searchValue: '',
    pageSize: 10,
    page: 1,
    selectedTypes: [],
  })

  const isNothingSelected = filters.selectedTypes.length === 0

  const deselectAll = useCallback(() => {
    setFilters({ ...filters, selectedTypes: [], page: 1 })
  }, [filters])

  const isTypeSelected = useCallback(
    (type: CommonSearchType) => {
      return filters.selectedTypes.includes(type)
    },
    [filters]
  )

  const changeTypeSelected = useCallback(
    (changedType: CommonSearchType) => {
      return (value: boolean) => {
        const newSelectedTypes = value
          ? [...filters.selectedTypes, changedType]
          : filters.selectedTypes.filter((type) => type !== changedType)

        setFilters({ ...filters, selectedTypes: newSelectedTypes })
      }
    },
    [filters]
  )

  const { input, setInput, searchValue, setSearchValue } = useSearch({ syncWithUrlQuery: true })

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page })
  }

  useEffect(() => {
    setFilters({ ...filters, searchValue })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue])

  const { dataToDisplay, loadingAndNoDataToDisplay, delayedLoading } = useSwrWithExtras(
    getCommonSearchSwrKey(filters, i18n.language),
    commonSearchFetcher(filters, i18n.language)
  )

  return (
    <>
      <SectionContainer>
        <PageBreadcrumbs page={pageEntity} />
      </SectionContainer>
      <SectionContainer>
        <PageTitle
          title={pageEntity?.attributes?.title ?? t('searchResults')}
          description={pageEntity?.attributes?.description ?? ''}
          hasDivider={false}
        />
        <div className="mt-6 flex flex-col gap-y-4 lg:flex-row lg:gap-y-0">
          <SearchField
            className="h-16"
            // inputClassName="py-2 lg:py-5 text-sm w-full"
            input={input}
            setInput={setInput}
            setSearchValue={setSearchValue}
          />

          <Button className="w-full py-[9px] lg:w-auto lg:py-4.25 lg:px-8">{t('search')}</Button>
        </div>
        <div className="mt-5 flex flex-col-reverse justify-between gap-3 md:flex-row md:items-center">
          <div className="flex w-full items-center gap-3 overflow-auto pb-3 sm:pb-0">
            <TagToggle isSelected={isNothingSelected} onChange={deselectAll}>
              {t('allResults')}
            </TagToggle>
            {allSearchTypes.map((type) => {
              return (
                <TagToggle
                  isSelected={isTypeSelected(type)}
                  onChange={changeTypeSelected(type)}
                  key={type}
                >
                  {t(`searchTags.${type}`)}
                </TagToggle>
              )
            })}
          </div>
        </div>
        <div className="mt-5 text-[16px] text-foreground-placeholder">
          {t('resultsFound', { count: dataToDisplay?.estimatedTotalHits })}
        </div>

        {/* eslint-disable-next-line sonarjs/no-redundant-boolean */}
        <div className="mt-12 flex flex-col gap-6">
          <AnimateHeight isVisible>
            {delayedLoading || loadingAndNoDataToDisplay ? (
              <div className="flex select-none flex-col gap-3">
                {Array.from({ length: filters.pageSize }, (_item, index) => (
                  <div key={index}>row</div>
                ))}
              </div>
            ) : dataToDisplay?.estimatedTotalHits === 0 ? (
              <motion.div
                initial={{ y: 48 }}
                animate={{ y: 0 }}
                className="flex justify-center py-8 text-lg"
              >
                {t('resultsFound', { count: 0 })}
              </motion.div>
            ) : (
              <div ref={resultsRef} className="flex flex-col">
                {dataToDisplay?.hits.map(({ title, link, type }, index) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <Link key={index} href={link} passHref>
                    <a>
                      <div
                        className={cx(
                          'group flex items-center justify-between border-b border-border-dark bg-white py-4 pr-2'
                        )}
                      >
                        <div className="flex items-center gap-x-6">
                          <div className="space-y-2">
                            <div className="flex items-center gap-x-4">
                              <h2>{title}</h2>
                              <span className="rounded-[4px] border border-dark px-2 py-[3px] text-[12px] leading-[12px]">
                                {/* TODO proper translation keys */}
                                {t(`searchTags.${type}`)}
                              </span>
                            </div>
                            <div className="flex items-center gap-x-3 text-xs text-foreground-body">
                              <span>/{link}</span>
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="ml-4 shrink-0" />
                      </div>
                    </a>
                  </Link>
                ))}
              </div>
            )}
          </AnimateHeight>
          {dataToDisplay?.estimatedTotalHits ? (
            <div className="flex justify-center">
              <Pagination
                max={Math.ceil(dataToDisplay.estimatedTotalHits / filters.pageSize)}
                onChangeNumber={handlePageChange}
                value={filters.page}
                previousButtonAriaLabel={t('previousPage')}
                nextButtonAriaLabel={t('nextPage')}
                currentInputAriaLabel={t('currentPage')}
              />
            </div>
          ) : null}
        </div>
      </SectionContainer>
    </>
  )
}

export default SearchPage
