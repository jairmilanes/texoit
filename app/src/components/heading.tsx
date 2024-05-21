import * as React from 'react';

export interface HeadingProps {
  text?: string;
  size?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
  children?: React.ReactElement;
}

const HeadingComponent: React.FC<HeadingProps> = ({ size, text, className, children }) => {
  switch (size) {
    case 1:
      return <h1 className={`text-2xl font-bold py-6 ${className}`}>{text || children}</h1>;
    case 3:
      return <h3 className={`text-lg font-bold py-2 ${className}`}>{text || children}</h3>;
    case 4:
      return <h4 className={`text-md font-bold py-2 ${className}`}>{text || children}</h4>;
    case 5:
      return <h5 className={`text-base font-semi py-2 ${className}`}>{text || children}</h5>;
    case 6:
      return <h6 className={`text-base font-bold py-2 ${className}`}>{text || children}</h6>;
    default:
      return <h2 className={`text-xl font-bold py-4 ${className}`}>{text || children}</h2>;
  }
};

export default HeadingComponent;
