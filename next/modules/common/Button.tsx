import MLink from '@modules/common/MLink'
import { LinkButtonProps } from '@react-types/button'
import cx from 'classnames'
import { forwardRef, ReactNode, Ref, RefObject } from 'react'
import { AriaButtonProps, useButton } from 'react-aria'
import { twMerge } from 'tailwind-merge'

type ButtonBase = {
  startIcon?: ReactNode
  endIcon?: ReactNode
  shape?: 'default' | 'circle'
  variant?:
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'plain-primary'
    | 'plain-secondary'
    | 'plain-white'
    | 'unstyled'
  mobileFullWidth?: boolean
  className?: string
  disabled?: boolean
  tabIndex?: number
}

/*
 *  This part makes the component return `HTMLAnchorElement` ref when `href` if provided and `HTMLButtonElement` when it's not.
 *  https://github.com/typescript-cheatsheets/react/issues/167#issuecomment-751347673
 */
export type ButtonProps = Omit<AriaButtonProps<'button'>, keyof LinkButtonProps> &
  ButtonBase & {
    ref?: Ref<HTMLButtonElement>
    href?: undefined
  }
export type AnchorProps = AriaButtonProps<'a'> &
  ButtonBase & {
    ref?: Ref<HTMLAnchorElement>
    href: string
  }

export type PolymorphicProps = ButtonProps | AnchorProps

type PolymorphicButton = {
  (props: AnchorProps): JSX.Element
  (props: ButtonProps): JSX.Element
}

const Button = forwardRef<HTMLAnchorElement | HTMLButtonElement, PolymorphicProps>(
  (
    {
      children,
      startIcon,
      endIcon,
      className,
      shape = 'default',
      variant = 'primary',
      mobileFullWidth,
      disabled,
      tabIndex,
      ...rest
    },
    ref
  ) => {
    const { buttonProps } = useButton(
      {
        ...rest,
        elementType: rest.href ? 'a' : 'button',
        isDisabled: disabled,
      },
      ref as RefObject<HTMLAnchorElement | HTMLButtonElement>
    )

    const baseStyle = 'appearance-none outline-1 outline-offset-2 focus:outline'

    const style =
      variant === 'unstyled'
        ? twMerge(baseStyle, className)
        : twMerge(
            cx(
              baseStyle,
              'inline-flex items-center justify-center gap-x-3 px-5 py-[9px] text-center text-sm uppercase tracking-wider',
              {
                'w-full lg:w-auto': mobileFullWidth,

                // text colors
                'text-white': variant === 'primary' || variant === 'plain-white',
                'text-foreground-dark':
                  variant === 'secondary' || variant === 'plain-primary' || variant === 'tertiary',
                'text-button-gray': variant === 'plain-secondary',

                // bg and border
                'border border-border-dark bg-button-dark hover:bg-button-hover':
                  variant === 'primary',
                'border border-border-dark hover:border-button-hover hover:text-button-hover':
                  variant === 'secondary',
                'border border-border-light hover:text-button-hover': variant === 'tertiary',

                // hover bg and border
                'hover:bg-button-hover': variant === 'primary',
                'hover:border-button-hover': variant === 'secondary',

                // hover-text
                'hover:text-button-hover':
                  variant === 'tertiary' ||
                  variant === 'plain-secondary' ||
                  variant === 'plain-primary' ||
                  variant === 'secondary',
                'hover:text-white hover:text-opacity-80': variant === 'plain-white',

                // shape
                'rounded-full': shape === 'circle',
              }
            ),
            className
          )

    if (rest.href) {
      /* react-aria adds role="button" which we don't want to use for <a>s */
      const buttonPropsFixed = { ...buttonProps, role: undefined }
      return (
        <MLink
          ref={ref as RefObject<HTMLAnchorElement>}
          href={rest.href}
          tabIndex={tabIndex}
          variant="unstyled"
          className={style}
          {...buttonPropsFixed}
        >
          {startIcon}
          {children}
          {endIcon}
        </MLink>
      )
    }

    return (
      <button
        type="button"
        ref={ref as RefObject<HTMLButtonElement>}
        tabIndex={tabIndex}
        className={style}
        {...buttonProps}
      >
        {startIcon}
        {children}
        {endIcon}
      </button>
    )
  }
) as PolymorphicButton

export default Button
