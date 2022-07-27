import ChevronRight from '@assets/images/chevron-right.svg'
import Home from '@assets/images/home.svg'
import { SectionContainer } from '@bratislava/ui-city-library'

import book_reader from '../../assets/images/book-reader.png'

interface IProps {
  code: number
  children?: React.ReactNode
}

function ErrorPage({ code, children }: IProps) {
  return (
    <SectionContainer>
      <div className="border-gray-700">
        <div className="flex h-[56px] text-sm">
          <a href="./" className="py-[18px]">
            <Home />{' '}
          </a>
          <div className="flex">
            <div className="py-[23px] pl-[18px]">
              <ChevronRight />
            </div>
            <div className="py-[18px] pl-3"> {code} </div>
          </div>
        </div>
        <div className="flex grid-cols-2 flex-col items-center py-12 md:grid">
          <div>{children}</div>
          <img
            src={book_reader.src}
            alt="book_readers"
            height={book_reader.height}
            width={book_reader.width}
          />
        </div>
      </div>
    </SectionContainer>
  )
}

export default ErrorPage
