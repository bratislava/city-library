// Admin navigation
import { I18NStatus } from "./services/helpers/getI18nStatus";
import { StrapiContentTypeInfo } from "strapi-typed";
import { FetchedEntry } from "./services/helpers/getEntries";

export type NavikronosRoute =
  | NavikronosContentTypeRoute
  | NavikronosEmptyRoute
  | NavikronosEntryRoute
  | NavikronosStaticRoute
  | NavikronosListingRoute;

export type NavikronosRoutes = NavikronosRoute[];

export type NavikronosRouteWithTitlePath = { title: string; path: string };
export type NavikronosRouteWithChildren = { children?: NavikronosRoute[] };

export type NavikronosContentTypeRoute = {
  type: "contentType";
  contentTypeUid: string;
};

export type NavikronosEmptyRoute = {
  type: "empty";
} & NavikronosRouteWithTitlePath &
  NavikronosRouteWithChildren;

export type NavikronosEntryRoute = {
  type: "entry";
  contentTypeUid: string;
  entryId: number;
  overrideTitle?: string;
  overridePath?: string;
} & NavikronosRouteWithChildren;

export type NavikronosStaticRoute = {
  type: "static";
  id: string;
} & NavikronosRouteWithTitlePath &
  NavikronosRouteWithChildren;

export type NavikronosListingRoute = {
  type: "listing";
  id: string;
} & NavikronosRouteWithTitlePath &
  NavikronosRouteWithChildren;

export type NavikronosNavigation = NavikronosRoutes;

export type NavikronosLocaleNavigations = Record<
  string,
  NavikronosNavigation | undefined
>;

export type NavikronosStorageContentType = {
  data: NavikronosLocaleNavigations;
};

const x: NavikronosNavigation = [
  { type: "static", title: "Vyhľadávanie", path: "vyhladavanie", id: "search" },
  {
    type: "listing",
    title: "Zažite",
    path: "zazite",
    id: "asda",
    children: [
      {
        type: "entry",
        contentTypeUid: "page",
        entryId: 1,
        children: [
          {
            type: "contentType",
            contentTypeUid: "page",
          },
        ],
      },
    ],
  },
];

// Client navigation
export type NavikronosClientRoute =
  | NavikronosClientContentTypeRoute
  | NavikronosClientEmptyRoute
  | NavikronosClientEntryRoute
  | NavikronosClientStaticRoute
  | NavikronosClientListingRoute;

export type NavikronosClientRoutes = NavikronosClientRoute[];

export type NavikronosClientRouteWithTitlePath = {
  title: string;
  path: string;
};
export type NavikronosClientRouteWithChildren = {
  children?: NavikronosClientRoute[];
};

export type NavikronosClientContentTypeRoute = {
  type: "contentType";
  contentTypeUid: string;
};

export type NavikronosClientEmptyRoute = {
  type: "empty";
} & NavikronosClientRouteWithTitlePath &
  NavikronosClientRouteWithChildren;

export type NavikronosClientEntryRoute = {
  type: "entry";
  contentTypeUid: string;
  entryId: number;
} & NavikronosClientRouteWithTitlePath &
  NavikronosClientRouteWithChildren;

export type NavikronosClientStaticRoute = {
  type: "static";
  id: string;
} & NavikronosClientRouteWithTitlePath &
  NavikronosClientRouteWithChildren;

export type NavikronosClientListingRoute = {
  type: "listing";
  id: string;
} & NavikronosClientRouteWithTitlePath &
  NavikronosClientRouteWithChildren;

export type NavikronosClientNavigation = NavikronosClientRoutes;

// Config
export type NavikronosConfig = {
  staticRouteIds?: string[];
  contentTypeRoutes?: {
    contentTypeUid: string;
  }[];
  entryRoutes?: {
    contentTypeUid: string;
    pathAttribute: string;
    titleAttribute: string;
  }[];
  // enableListing?: boolean;
};

export type AdminConfig = {
  i18n: I18NStatus;
  contentTypeRoutes: { contentTypeUid: string }[];
  entryRouteEntries: Record<string, FetchedEntry[]>;
  staticRouteIds: string[];
  contentTypeInfos: Record<string, StrapiContentTypeInfo>;
  // listingEnabled: boolean;
};

// API
export type ClientGetNavigationResponse = NavikronosClientNavigation;
export type AdminGetNavigationResponse = NavikronosLocaleNavigations;
export type AdminPutNavigationInput = {
  navigation: NavikronosLocaleNavigations;
};
export type AdminPutNavigationResponse = { success: true };
export type AdminGetConfigResponse = AdminConfig;

// Services
export type AdminService = {
  getConfig: () => Promise<AdminGetConfigResponse>;
  getNavigation: () => Promise<AdminGetNavigationResponse>;
  putNavigation: ({
    navigation,
  }: AdminPutNavigationInput) => Promise<AdminPutNavigationResponse>;
};

export type ClientService = {
  getNavigation: () => Promise<ClientGetNavigationResponse>;
};
