import * as React from 'react';

interface CardProps {
  id: string;
  children: React.ReactElement;
  className?: string;
}

const CardComponent: React.FC<CardProps> = ({ id, children, className }) => {
  return (
    <div
      data-id={id}
      className={`flex flex-col items-stretch justify-stretch text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-800 rounded-lg shadow-sm shadow-[rgba(132, 132, 132, 0.75)] ${className}`}
    >
      {children}
    </div>
  );
};

export default CardComponent;
