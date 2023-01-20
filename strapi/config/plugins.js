/**
 * The indexes that are used in search are stored in one shared index. This wraps them to have a unified way for search
 * and easily unwrappable structure to be used separately.
 */
const wrapSearchIndexEntry = (type, data) => {
  // Remove when https://github.com/meilisearch/strapi-plugin-meilisearch/pull/554 merged
  const newData = { ...data };
  delete newData.createdBy;
  delete newData.updatedBy;

  return {
    type,
    id: data.id, // must be present to work correctly
    locale: data.locale,
    // [type] is used instead of "data", to avoid  naming clashes of filterable / sortable / searchable attributes
    [type]: newData,
  };
};

// Because a bug in Meilisearch shared index, only the last added entity's settings are used and the old ones are overwritten
// instead of merging. Therefore, for all entities we must provide shared settings.
const searchIndexSettings = {
  searchableAttributes: [
    // Page
    "page.title",
    "page.description",
    // Basic documents
    "basic-document.title",
    "basic-document.description",
    // Blog post
    "blog-post.title",
    // Event
    "event.title",
    "event.description",
    // Notice
    "notice.title",
  ],
  filterableAttributes: [
    // All
    "type",
    // Page + Event`
    "locale",
    // Basic document
    "basic-document.file_category.id",
    // Event
    "event.dateFromTimestamp",
    "event.dateToTimestamp",
    "event.eventTagsIds",
    "event.eventCategory.id",
    "event.branch.id",
  ],
  sortableAttributes: [
    // Basic document
    "basic-document.date_added",
    // Event
    "event.dateFromTimestamp",
  ],
  pagination: {
    // https://docs.meilisearch.com/learn/advanced/known_limitations.html#maximum-number-of-results-per-search
    maxTotalHits: 100000,
  },
};

module.exports = ({ env }) => ({
  graphql: {
    config: {
      defaultLimit: 100,
      artifacts: {
        schema: true,
      },
    },
  },
  navikronos: {
    enabled: true,
    resolve: "./src/plugins/navikronos",
    config: {
      staticPages: ["search"],
      spreadContentTypes: ["api::branch.branch"],
      specificContentTypes: [
        { contentType: "api::page.page", entityRouteId: "slug" },
        { contentType: "api::notice.notice", entityRouteId: "slug" },
      ],
    },
  },
  meilisearch: {
    config: {
      host: process.env.MEILISEARCH_HOST,
      apiKey: process.env.MEILISEARCH_ADMIN_API_KEY,

      page: {
        indexName: "search_index",
        entriesQuery: {
          locale: "all",
        },
        settings: searchIndexSettings,
        transformEntry: ({ entry }) => wrapSearchIndexEntry("page", entry),
      },

      "basic-document": {
        indexName: "search_index",
        settings: searchIndexSettings,
        transformEntry: ({ entry }) =>
          wrapSearchIndexEntry("basic-document", {
            ...entry,
            // Meilisearch doesn't support filtering dates as ISO strings, therefore we convert it to UNIX timestamp to
            // use (number) filters.
            date_added: entry.date_added
              ? new Date(entry.date_added).getTime()
              : undefined,
          }),
      },

      "blog-post": {
        indexName: "search_index",
        settings: searchIndexSettings,
        transformEntry: ({ entry }) => wrapSearchIndexEntry("blog-post", entry),
      },

      event: {
        indexName: "search_index",
        entriesQuery: {
          locale: "all",
        },
        settings: searchIndexSettings,
        transformEntry: ({ entry }) =>
          wrapSearchIndexEntry("event", {
            ...entry,
            // Meilisearch doesn't support filtering dates as ISO strings, therefore we convert it to UNIX timestamp to
            // use (number) filters.
            dateFromTimestamp: entry.dateFrom
              ? new Date(entry.dateFrom).getTime()
              : undefined,
            dateToTimestamp: entry.dateTo
              ? new Date(entry.dateTo).getTime()
              : undefined,
            // It is not possible to filter nested object in arrays in Meilisearch, so we map it to a basic array with
            // string values.
            eventTagsIds: (entry.eventTags ?? []).map(({ id }) => id),
          }),
      },
      notice: {
        indexName: "search_index",
        entriesQuery: {
          locale: "all",
        },
        settings: searchIndexSettings,
        transformEntry: ({ entry }) => wrapSearchIndexEntry("notice", entry),
      },
    },
  },
});
