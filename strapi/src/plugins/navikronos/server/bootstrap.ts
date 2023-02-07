import { IStrapi } from "strapi-typed";
import { getConfig, validateConfig } from "./services/helpers/config";

const symbol = Symbol("adsas");

export default async ({ strapi }: { strapi: IStrapi }) => {
  const config = getConfig(strapi);
  validateConfig(strapi, config);

  // const x = (await strapi.query("api::page.page").findMany({})) as any[];
  //
  // for (let a of x) {
  //   if (a.slug) {
  //     const s = a.slug.split("/");
  //     const newSlug = last(s);
  //     console.log(newSlug);
  //     await strapi
  //       .query("api::page.page")
  //       .update({ where: { id: a.id } as any, data: { newSlug } });
  //   }
  // }
  // Convert pages to

  const gett = async (locale: string) => {
    const b = (await strapi
      .query("api::page.page")
      .findMany({ where: { locale } as any })) as any[];

    const gg = [];

    b.map((a) => {
      return { ...a, slug: a.slug.split("/") };
    })
      .sort((a, b) => a.slug.length - b.slug.length)
      .forEach((a) => {
        let current = gg;
        console.log(a.slug);

        a.slug.slice(0, -1).forEach((s) => {
          // @ts-ignore
          current = current.find((a) => a[symbol] === s).children;
        });
        if (!current.find((a) => a[symbol] === a.newSlug)) {
          current.push({
            type: "entry",
            contentTypeUid: "api::page.page",
            entryId: a.id,
            [symbol]: a.newSlug,
            children: [],
          });
        }
      });

    return gg;
  };
  // const final = await { sk: await gett("sk"), en: await gett("en") };
  //
  // console.log(JSON.stringify(final, null, 2));
};
