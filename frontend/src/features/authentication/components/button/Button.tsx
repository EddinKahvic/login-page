import type { ButtonHTMLAttributes } from 'react'
import classes from './Button.module.scss'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  outline?: boolean
}

export function Button({ outline, children, ...otherProps }: ButtonProps) {
  return (
    <button
      {...otherProps}
      className={`${classes.root} ${outline ? classes.outline : ''}`}
    >
      {children}
    </button>
  )
}
