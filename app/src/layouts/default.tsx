import * as React from 'react';
import HeaderComponent from '../components/header';

interface LayoutProps {
  size: 'md' | 'lg' | 'xl';
    title: string;
  children: React.ReactElement;
}

const defaultProps: Partial<LayoutProps> = {
  size: 'lg',
    title: ""
};

const DefaultLayout: React.FC<LayoutProps> = ({ title, size, children }) => {
  return (
    <>
      <HeaderComponent text={title} className="text-neutral-700 dark:text-neutral-400"/>
      <main className="relative grow flex flex-col items-center p-[30px] h-full w-full overflow-y-auto   font-sans text-base bg-gray-100 dark:bg-gray-900">
        <section className={`container max-w-screen-${size} flex gap-6 mx-auto`}>
          {children}
        </section>
      </main>
      <aside
        id="default-sidebar"
        className="fixed top-0 left-0 z-40 hidden lg:block w-64 h-screen bg-neutral-200 dark:bg-neutral-950 transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <HeaderComponent text="MoviesApp" align="left" className="px-6 border-b border-neutral-800 text-primary-500 bg-neutral-200 dark:bg-neutral-950"/>
        <div className="h-full px-3 py-4 overflow-y-auto0">
            <ul className="space-y-2 font-medium">
                <li>
                    <a href="/" className="group flex items-center p-2 rounded-lg text-neutral-700 dark:text-neutral-200 hover:bg-neutral-300 dark:hover:bg-neutral-800 group">
                        <span className="material-symbols-outlined text-2xl transition duration-75 group-hover:text-accent-600">home</span>
                        <span className="ms-3 text-neutral-700 dark:text-neutral-200">Dashboard</span>
                    </a>
                </li>
                <li>
                    <a href="/movies" className="group flex items-center p-2 rounded-lg text-neutral-700 dark:text-neutral-200 hover:bg-neutral-300 dark:hover:bg-neutral-800 group">
                        <span className="material-symbols-outlined text-2xl transition duration-75 group-hover:text-accent-600">search</span>
                        <span className="ms-3 text-neutral-700 dark:text-neutral-200">Movies</span>
                    </a>
                </li>
            </ul>
        </div>
      </aside>
    </>
  );
};

DefaultLayout.defaultProps = defaultProps;

export default DefaultLayout;
