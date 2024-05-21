import * as React from 'react';
import type { HeadFC, PageProps } from 'gatsby';
import ReactPaginate from 'react-paginate';
import DefaultLayout from '../layouts/default';
import TableComponent from '../components/table';
import { useCallback, useEffect, useRef, useState } from 'react';
import api from '../services/api';
import { SearchQuery, SearchResult } from '../types';
import { useQuery } from '../hooks/use-query';
import FormTextComponent from '../components/form/text';
import FormSelectComponent from '../components/form/select';

const tableHeaders = {
  id: 'Id',
  year: 'Year',
  title: 'Title',
  studios: 'Studios',
  producers: 'Producers',
  winner: 'Winner',
};

const defaultResult = {
  items: [],
  page: 1,
  pages: 1,
  count: 0,
  limit: 10,
  offset: 0,
  next: null,
  prev: null,
};

const defaultSearch: SearchQuery = {
  q: '',
  year: '',
  page: 1,
};

const winnerOptions = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
];

const MoviesPage: React.FC<PageProps> = () => {
  const timer = useRef<NodeJS.Timeout>();
  const [loading, setLoading] = useState<boolean>(false);
  const [query, setQuery] = useQuery<SearchQuery>(defaultSearch);
  const [state, setState] = useState<SearchResult>(defaultResult);
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    api.get<SearchResult>('/movies', { ...query }).then((results) => {
      setState(results);
      setLoading(false);
    });
  }, [query, setState, setLoading]);

  useEffect(() => {
    clearTimeout(timer.current);
    setLoading(true);
    timer.current = setTimeout(() => {
      if (values?.year !== query?.year || values?.winner !== query?.winner) {
        setQuery({
          ...query,
          ...values,
        });
      }
    }, 1000);
  }, [values, query, timer, setQuery]);

  const handleClick = useCallback(
    (e: { selected: number }) => {
      setQuery({
        ...query,
        page: e.selected + 1,
      });
    },
    [query, setQuery],
  );

  const handleChange = useCallback(
    (name: string) => (e: React.FormEvent<HTMLInputElement | HTMLSelectElement>) => {
      setValues({
        ...values,
        [name]: e.currentTarget.value,
      });
    },
    [values, setValues],
  );

  const searchables = {
    year: (
      <FormTextComponent
        name={`year`}
        loading={loading}
        value={values[`year`]}
        onChange={handleChange(`year`)}
      />
    ),
    winner: (
      <FormSelectComponent
        name={`winner`}
        loading={loading}
        value={values[`winner`]}
        options={winnerOptions}
        onChange={handleChange(`winner`)}
      />
    ),
  };

  return (
    <DefaultLayout title="Search Golden Raspberry Awards Winners" size="xl">
      <div className="flex flex-col gap-10 w-full">
        <TableComponent id="movie-search" rows={state?.items || []} headers={tableHeaders} searchable={searchables} />
        <div className="flex gap-6">
          <div className="grow text-gray-200">
            {!!state.limit && (
              <span>
                Display <span className="font-bold">{state.limit - (state?.offset || 0)} </span> of{' '}
                <span className="font-bold">{state.count}</span> results
              </span>
            )}
          </div>
          <ReactPaginate
            breakLabel="..."
            nextLabel="next >"
            onPageChange={handleClick}
            pageRangeDisplayed={5}
            pageCount={state?.pages}
            previousLabel="< prev"
            renderOnZeroPageCount={null}
            className="flex items-center -space-x-px h-8 text-sm"
            pageClassName="pageClassName"
            pageLinkClassName="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            activeClassName="activeClassName"
            activeLinkClassName="z-10 flex items-center justify-center px-3 h-8 leading-tight text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
            previousClassName="previousClassName"
            previousLinkClassName="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            nextClassName="nextClassName"
            nextLinkClassName="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            disabledClassName="disabledClassName"
            disabledLinkClassName="disabledLinkClassName"
          />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default MoviesPage;

export const Head: HeadFC = () => {
  return (
    <>
      <title>Home Page</title>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
      />
    </>
  );
};
