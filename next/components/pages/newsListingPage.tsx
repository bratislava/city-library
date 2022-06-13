import { useMemo, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { ReactComponent as ArrowLeft } from '../../assets/images/arrow-left.svg';
import { ReactComponent as ChevronRight } from '../../assets/images/chevron-right.svg';
import PageBreadcrumbs from '../../components/Molecules/PageBreadcrumbs';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { Pagination, SectionContainer } from '@bratislava/ui-city-library';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { PageFragment } from '@bratislava/strapi-sdk-city-library';
import NewsListingCard from '../../components/Molecules/NewsListingCard';
import { IEvent } from '../../utils/types';
import { useTranslation } from 'next-i18next';

export interface PageProps {
  page: PageFragment;
  news: IEvent[];
}

const NewsListingPage = ({ page, news }: PageProps) => {
  const { t } = useTranslation('common');

  const [noOfPages, setNoOfPages] = useState(Math.ceil(news.length / 12));

  const [offsetPage, setOffsetPage] = useState(1);

  const paginatedNews = useMemo(() => {
    return news.slice((offsetPage - 1) * 12, 12 * offsetPage);
  }, [offsetPage, news]);

  const handleChangeOffsetPage = (num: number) => {
    if (num > 0 && num <= noOfPages) setOffsetPage(num);
  };

  return (
    <>
      <SectionContainer>
        <PageBreadcrumbs page={page} />
      </SectionContainer>
      <SectionContainer>
        <div className="pb-[48px]">
          <div className="pt-16">
            <header className="m-auto text-[40px] leading-[48px] border-b border-gray-900">
              <h1>{t('newsListingTitle')}</h1>
            </header>
          </div>
        </div>

        <div className="pt-6 pb-16 m-auto grid sm:grid-cols-2 gap-4 lg:gap-x-5 items-stretch md:grid-cols-3 lg:grid-cols-4 gap-y-10">
          {paginatedNews?.map((event) => (
            <NewsListingCard event={event} key={event.slug} />
          ))}
        </div>
        <div className="flex md:mr-0 w-fit m-auto">
          <Pagination
            max={noOfPages}
            value={offsetPage}
            onChangeNumber={(num) => {
              handleChangeOffsetPage(num);
            }}
            previousButtonAriaLabel={t('previousPage')}
            nextButtonAriaLabel={t('nextPage')}
            currentInputAriaLabel={t('currentPage')}
          />
        </div>
      </SectionContainer>
    </>
  );
};

export default NewsListingPage;
