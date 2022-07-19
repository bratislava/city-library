import Arrow from '@assets/images/arrow-right.svg'
import { useUIContext } from '@bratislava/common-frontend-ui-context'
import { ComponentHomepageFaqSection } from '@bratislava/strapi-sdk-city-library'
import { Accordion, CallToAction } from '@bratislava/ui-city-library'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import React, { useState } from 'react'

interface SectionFaqProps {
  faqSection: ComponentHomepageFaqSection
}

function SectionFaq({ faqSection }: SectionFaqProps) {
  const { t } = useTranslation(['homepage', 'common'])
  const [openFaq, setOpenFaq] = useState('')
  const { Markdown: UIMarkdown } = useUIContext()

  const listenAccordionState = (id: string, state: boolean) => {
    setOpenFaq(state ? id : '')
  }

  return (
    <section className="py-12">
      <div className="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8">
        <div className="w-full md:w-96 space-y-4">
          {faqSection?.ctas?.map((cta) => (
            <div key={cta?.title}>
              {cta?.ctaRedirectTo?.data?.attributes?.slug && (
                <CallToAction
                  title={cta?.title || ''}
                  href={cta?.ctaRedirectTo?.data?.attributes.slug}
                  bottomText=""
                  className="w-full h-[222px] p-4 hover:underline text-md2"
                  customIcon={<Arrow />}
                  hasIcon={false}
                  uppercase={false}
                />
              )}
            </div>
          ))}
        </div>
        <div className="border-l border-gray-700" />
        <div className="w-full">
          <h2 className="text-md mb-8">{faqSection?.title ?? t('faqTitle')}</h2>
          {faqSection?.faqs?.map((faq) => (
            <Accordion
              className="w-full"
              id={faq?.id}
              key={faq?.id}
              type="divider"
              size="big"
              stateListener={listenAccordionState}
              defaultState={openFaq === faq?.id}
              ariaLabelPrefix={openFaq === faq?.id ? t('openAccordian') : t('closeAccordian')}
              label={faq?.question || ''}
              content={<UIMarkdown content={faq?.answer || ''} />}
            />
          ))}
          <div className="pt-6 font-serif cursor-pointer text-xs">
            <Link href={faqSection?.redirectTo?.data?.attributes?.slug ?? '#'} passHref>
              <a href={faqSection?.redirectTo?.data?.attributes?.slug ?? '#'} className="uppercase">
                {t('showMore', { ns: 'common' })} {'>'}
              </a>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SectionFaq
