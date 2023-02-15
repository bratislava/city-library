import { GetStaticPropsContext } from 'next/types'

import { fetchNavigation } from './fetchNavigation'
import { NavikronosConfig, NavikronosStaticProps, RouteEntity } from './types'

export const navikronosGetStaticProps = async <Config extends NavikronosConfig>(
  navikronosConfig: Config,
  { locale }: Pick<GetStaticPropsContext, 'locale'>,
  currentEntity?: RouteEntity<Config>
) => {
  const { navigation } = await fetchNavigation(navikronosConfig)

  return {
    navigation,
    currentEntity: currentEntity ?? null,
    locale,
  } as NavikronosStaticProps<Config>
}
