import * as React from 'react';
import type { HeadFC, PageProps } from 'gatsby';
import DefaultLayout from '../layouts/default';
import WinnersByYearModule from '../modules/winners-by-year';
import Top3StudiosModule from '../modules/top-studios';
import ProducersRangeModule from '../modules/producers-range';
import MovieByYearModule from '../modules/movie-by-year';

const IndexPage: React.FC<PageProps> = () => {
  return (
    <DefaultLayout title="Dashboard" size="xl">
      <div className="flex flex-col gap-10 w-full">
        <div className="w-full grid grid-cols-2 items-start gap-x-[30px]">
          <WinnersByYearModule className="" />
          <Top3StudiosModule className="" />
        </div>
        <div className="w-full grid grid-cols-2 items-start gap-x-[30px]">
          <ProducersRangeModule className="" />
          <MovieByYearModule className="" />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default IndexPage;

export const Head: HeadFC = () => {
  return (
    <>
      <title>Home Page</title>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400,600,700;1,100..900&display=swap"
      />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
      />
    </>
  );
};
