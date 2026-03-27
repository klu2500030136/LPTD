import React from 'react';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    fullWidth = false,
    ...props
}) => {
    const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]';

    const variants = {
        primary: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 focus:ring-blue-500 border border-transparent',
        secondary: 'bg-white text-gray-800 shadow-sm border border-gray-200 hover:border-gray-300 hover:shadow-md hover:text-blue-600 hover:-translate-y-0.5 focus:ring-gray-200',
        outline: 'border-2 border-gray-200/80 text-gray-700 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50/50 focus:ring-blue-500 backdrop-blur-sm',
        danger: 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-md shadow-red-500/20 hover:shadow-lg hover:shadow-red-500/30 hover:-translate-y-0.5 focus:ring-red-500 border border-transparent',
        ghost: 'text-gray-600 hover:bg-gray-100/80 hover:text-gray-900 focus:ring-gray-200'
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg'
    };

    const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`;

    return (
        <button className={classes} {...props}>
            {children}
        </button>
    );
};

export default Button;
