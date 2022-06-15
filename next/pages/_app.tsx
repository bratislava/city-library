import { AppProps } from 'next/app'
import Script from 'next/script'
import './index.css'
import React from 'react'

import { UIContextProvider } from '@bratislava/common-frontend-ui-context'
import Link from 'next/link'
import { CityLibraryMarkdown } from '../components/Atoms/CityLibraryMarkdown'
import { appWithTranslation } from 'next-i18next'

import ErrorDisplay from '../components/Molecules/ErrorDisplay'
import ErrorPage from '../components/pages/ErrorPage'
// import CookieConsent from '../components/Molecules/CookieConsent'

function CustomApp({ Component, pageProps, router }: AppProps): JSX.Element {
  if (pageProps.error) {
    return (
      <ErrorPage code={500}>
        <ErrorDisplay error={pageProps.error} />
      </ErrorPage>
    )
  }
  return (
    <div className="font-beausite text-default">
      <Script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=Intl.~locale.sk" />
      <UIContextProvider
        components={{
          Link: ({ href, className, children, locale, target, rel }) => {
            if (href === undefined || href === null) return null
            return (
              <Link href={href} locale={locale}>
                <a target={target} rel={rel} href={href} className={className}>
                  {children}
                </a>
              </Link>
            )
          },
          Image: ({ alt, src }) => <img alt={alt} src={src} />,
          Markdown: ({ className, paragraphClassName, content }) => (
            <CityLibraryMarkdown className={className} paragraphClassName={paragraphClassName} content={content} />
          ),
        }}
      >
        <Component {...pageProps} />
      </UIContextProvider>
      {/* <CookieConsent /> */}
    </div>
  )
}

export default appWithTranslation(CustomApp)
