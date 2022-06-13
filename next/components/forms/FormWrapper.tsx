import cx from 'classnames';
import React from 'react';
import FormSubmittedComponent from './FormSubmittedComponent';
import { ReactComponent as CloseIcon } from '../../assets/images/close.svg';
import Link from 'next/link';

export const phoneRegex = /(^(\+[\d]{1,3}|0) ?[0-9]{3} ?[0-9]{3} ?[0-9]{3}$)/;
export const postalCodeRegex = /^[0-9]{5}(?:-[0-9]{4})?$/;
export const IBANRegex = /^[A-Z]{2}(?:[ ]?[0-9]){13,30}$/;

interface IProps {
  className?: string;
  children: React.ReactNode;
  title: string;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  isSubmitted: boolean;
}

const FormWrapper = ({
  className,
  children,
  title,
  onSubmit,
  isSubmitted,
}: IProps) => {
  return (
    <div
      className={cx(
        className,
        'lg:px-8 lg:pt-8 w-72 lg:w-full max-w-[680px] lg:border lg:border-gray-universal-100'
      )}
    >
      <div className="flex justify-between -mx-4 px-4 border-b border-gray-universal-100 py-4.5 lg:py-0 lg:border-none">
        <h4 className="text-base lg:text-md font-normal">{title}</h4>
        <Link href="#" passHref>
          <CloseIcon className="lg:hidden" />
        </Link>
      </div>
      <form className="mt-6 flex flex-col gap-y-8" onSubmit={onSubmit}>
        {/* Here are the children of each form if unsubmitted, otherwise default SubmittedFormComponent */}
        <FormSubmittedComponent
          className={cx({
            hidden: !isSubmitted,
          })}
        />
        <div
          className={cx({
            hidden: isSubmitted,
          })}
        >
          {children}
        </div>
      </form>
    </div>
  );
};

export default FormWrapper;
