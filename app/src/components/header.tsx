import * as React from 'react';
export interface HeaderProps {
    text: string;
    align?: "center" | "left";
    className?: string;
}

const HeaderComponent: React.FC<HeaderProps> = ({ text, align, className }) => {
  return (
    <header className={`flex gap-6 bg-neutral-800 py-[14px] ${className}`}>
      <div className={`container relative max-w-screen-xl mx-auto flex items-center justify-${align || "center"}`}>
        <span className="font-bold text-xl">{text}</span>
      </div>
    </header>
  );
};

export default HeaderComponent;
