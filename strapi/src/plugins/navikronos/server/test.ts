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
  entryId: string;
  overrideTitle?: string;
  overridePath?: string;
} & NavikronosRouteWithChildren;

export type NavikronosStaticRoute = {
  type: "static";
} & NavikronosRouteWithTitlePath &
  NavikronosRouteWithChildren;

export type NavikronosListingRoute = {
  type: "listing";
} & NavikronosRouteWithTitlePath &
  NavikronosRouteWithChildren;

export type NavikronosNavigation = NavikronosRoutes;
