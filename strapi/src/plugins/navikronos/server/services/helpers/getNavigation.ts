import { IStrapi } from "strapi-typed";
import {
  NavikronosLocaleNavigations,
  NavikronosStorageContentType,
} from "../../../shared/types";
import { getI18nStatus } from "./getI18nStatus";

export const getNavigation = async (strapi: IStrapi) => {
  const i18n = await getI18nStatus({ strapi });

  const navigation = await strapi
    .query<NavikronosStorageContentType>(
      "plugin::navikronos.navikronos-storage"
    )
    .findOne({});

  return navigation?.data ?? ({} as NavikronosLocaleNavigations);
};
