import {
  CategoryFragment,
  ExternalLinkFragment,
  FlatTextFragment,
  PageCategoryFragment,
  PageLinkFragment,
  PartnerFragment,
  SubpagesFragment,
  TableRowFragment,
} from '@bratislava/strapi-sdk-city-library';
import {
  SidebarProps,
  SubpageItemProps,
  TableRowProps,
  TExternalLinksSection,
} from '@bratislava/ui-city-library';
import { groupBy } from 'lodash';
import orderBy from 'lodash/orderBy';
import { TSortedPartners } from '../components/pages/partnersPage';
import { isPresent } from './utils';

export const localePath = (locale: string, slug: string) => {
  // Special case for slovak homepage, so it is not empty string
  if (locale === 'sk' && slug === '') return '/';
  const localePrefix = locale === 'sk' ? '' : `${locale}/`;
  return `${localePrefix}${slug}`;
};

export const pagePath = (
  page?: {
    locale?: string | null;
    slug?: string | null;
  } | null
): string | null => {
  if (!page) return null;
  const { locale, slug } = page;
  if (!locale || !slug) return slug ?? null;
  return localePath(locale, slug);
};

export const parsePageLink = (
  pageLink?: Omit<PageLinkFragment, '__typename'> | null
): { title: string; url: string } | null => {
  if (!pageLink) return null;

  return {
    title: pageLink.page?.title || '',
    url: pageLink.url ?? pagePath(pageLink.page) ?? '',
  };
};

// Pages (PageLinks)
export const parsePages = (
  pages:
    | (Omit<PageLinkFragment, '__typename'> | undefined | null)[]
    | undefined
    | null
): {
  title: string;
  url: string;
}[] => pages?.map((page) => parsePageLink(page)).filter(isPresent) ?? [];

// Listing categories in listing and sublisting page
export const parseSubCategories = (
  subCategories: (CategoryFragment | undefined | null)[]
): {
  title: string;
  url: string;
  moreLinkTitle: string;
  pages: { title: string; url: string }[];
}[] =>
  orderBy(subCategories ?? [], ['priority'], ['asc']).map((subCategory) => ({
    title: parsePageLink(subCategory?.pageLink)?.title ?? '',
    url: parsePageLink(subCategory?.pageLink)?.url ?? '',
    moreLinkTitle: subCategory?.pageLink?.title ?? 'VIAC',
    pages: parsePages(subCategory?.pages?.filter(isPresent) ?? []),
  }));

// SideBar for content with sidebar
export const parseSidebar = (
  pageCategory: PageCategoryFragment | undefined,
  pageSlug?: string
): SidebarProps | undefined => {
  if (!pageCategory) return undefined;

  return {
    title: parsePageLink(pageCategory.pageLink)?.title ?? '',
    href: parsePageLink(pageCategory.pageLink)?.url ?? '#',
    categories:
      pageCategory.pages?.map((p) => ({
        title: parsePageLink(p)?.title ?? '',
        href: parsePageLink(p)?.url ?? '',
      })) ?? [],
    activeCategory:
      pageCategory.pages?.findIndex((x) => x?.page?.slug === pageSlug) ?? 0,
  };
};

// Subpages
export const parseSubpages = (subpages: SubpagesFragment): SubpageItemProps[] =>
  subpages?.subpages?.filter(isPresent).map((subpage) => ({
    title: subpage?.title ?? '',
    description: subpage?.description ?? '',
    url: parsePageLink(subpage)?.url,
  })) ?? [];

// PartnersPage
export const sortPartners = (
  allPartners: PartnerFragment[]
): TSortedPartners => {
  const grouped = groupBy(allPartners, 'featured');
  return {
    featuredPartners: orderBy(grouped['true'], ['priority'], ['asc']),
    notFeaturedPartners: orderBy(grouped['false'], ['priority'], ['asc']),
  };
};

// Group by for accordion
export const groupByAccordionCategory = (
  tableRows: (TableRowFragment | undefined | null)[]
): { title: string; tables: { title: string; rows: TableRowProps[] }[] }[] => {
  const groupedItems = groupBy(tableRows, 'accordionCategory');
  const groupedByAccordion = Object.keys(groupedItems).map((key) => ({
    title: key,
    tables: groupByTableCategory(groupedItems[key]),
  }));

  return groupedByAccordion;
};

export const groupByTableCategory = (
  tableRows: (TableRowFragment | undefined | null)[]
): { title: string; rows: TableRowProps[] }[] => {
  const grouped = groupBy(tableRows, 'tableCategory');
  const groupedRows = Object.keys(grouped).map((key) => ({
    title: key,
    rows: grouped[key],
  }));

  const rows = groupedRows.map((groupedRow) => ({
    title: groupedRow.title,
    rows:
      groupedRow.rows?.map((row) => ({
        label: row?.label ?? '',
        value: row?.value ?? '',
        valueAlign: row?.valueAlign ?? 'start',
      })) ?? [],
  }));

  return rows;
};

// Page Accordion Items
export const groupByCategory = <T>(items: T[]) => {
  const grouped = groupBy(items, 'category');
  const groupedItems = Object.keys(grouped).map((key) => ({
    category: key,
    items: grouped[key],
  }));
  return groupedItems;
};

// Page external links sections
export const groupByLinksCategory = (
  descriptions?: Array<FlatTextFragment | null | undefined>,
  links?: Array<ExternalLinkFragment | null | undefined>
): TExternalLinksSection[] => {
  const groupedLinks = links ? groupByCategory(links) : [];
  const groupedDescriptions = descriptions ? groupByCategory(descriptions) : [];

  const externalLinks = groupedLinks.map((link) => ({
    description:
      groupedDescriptions.find((d) => d.category === link.category)?.items[0]
        ?.content ?? undefined,
    links: link.items?.map((item) => ({
      title: item?.title ?? '',
      url: item?.url ?? '#',
    })),
  }));

  return externalLinks;
};
