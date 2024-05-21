import * as React from 'react';

const styles: Record<'primaryDark' | 'primaryLight' | 'disabled', string> = {
  primaryDark: `text-white bg-primary-dark border border-primary-300 hover:bg-primary-light focus:ring-primary-100`,
  primaryLight: `text-white bg-primary-light border border-primary-300 hover:bg-primary-light focus:ring-primary-100`,
  disabled: `text-white bg-gray-200 border border-gray-300 hover:bg-gray-100 focus:ring-gray-100`,
};

export interface ButtonProps {
  type?: 'submit' | 'reset' | 'button';
  text: string;
  id?: string;
  color?: 'primaryDark' | 'primaryLight' | 'disabled';
  width?: string;
  disabled?: boolean;
  onClick?: (e: React.FormEvent) => void;
}

const ButtonProps: ButtonProps = {
  text: 'Button',
  type: 'button',
  color: 'primaryLight',
};

const ButtonComponent: React.FC<ButtonProps> = ({
  id,
  text,
  type,
  width,
  color,
  disabled,
  onClick,
}) => {
  return (
    <button
      id={id}
      disabled={disabled}
      type={type}
      onClick={onClick}
      className={`w-${width || 'auto'} focus:outline-none focus:ring-4 font-bold rounded-full text-base uppercase px-[20px] py-[8px] ${color ? styles[color] : ''}`}
    >
      {text}
    </button>
  );
};

ButtonComponent.defaultProps = ButtonProps;

export default ButtonComponent;
