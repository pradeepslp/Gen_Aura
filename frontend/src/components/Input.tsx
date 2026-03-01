import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, icon, ...props }, ref) => {
        return (
            <div className="w-full space-y-1.5">
                {label && (
                    <label className="text-sm font-medium text-slate-400">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {icon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                            {React.cloneElement(icon as React.ReactElement, { size: 18 } as any)}
                        </div>
                    )}
                    <input
                        suppressHydrationWarning
                        ref={ref}
                        className={cn(
                            'flex h-11 w-full rounded-md border border-border bg-white/5 px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-all',
                            icon && 'pl-10',
                            error && 'border-destructive focus-visible:ring-destructive',
                            className
                        )}
                        {...props}
                    />
                </div>
                {error && (
                    <p className="text-xs text-destructive">{error}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';
