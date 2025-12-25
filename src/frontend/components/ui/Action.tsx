import type { ComponentProps } from 'react';

export type ActionsProps = ComponentProps<'div'>;

export const Actions = ({ className, children, ...props }: ActionsProps) => (
  <div className={`flex items-center gap-1 mt-2 ${className || ''}`} {...props}>
    {children}
  </div>
);

export type ActionProps = ComponentProps<'button'> & {
  label?: string;
};

export const Action = ({
  children,
  label,
  className,
  ...props
}: ActionProps) => {
  return (
    <button
      className={`inline-flex items-center justify-center p-2 text-text-muted hover:text-text hover:bg-surface-secondary transition-all rounded-md border border-transparent hover:border-border ${className || ''}`}
      type="button"
      title={label}
      {...props}
    >
      {children}
      <span className="sr-only">{label}</span>
    </button>
  );
};
