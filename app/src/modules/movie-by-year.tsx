import * as React from 'react';
import HeadingComponent from '../components/heading';
import TableComponent from '../components/table';
import { useEffect, useState } from 'react';
import CardComponent from '../components/card';
import api from '../services/api';

interface Result {
  id: number;
  year: number;
  title: string;
}

interface MovieByYearProps {
  className?: string;
}

const tableHeaders = {
  id: 'Id',
  year: 'Year',
  title: 'Title',
};

const MovieByYearModule: React.FC<MovieByYearProps> = ({ className }) => {
  const [rows, setRows] = useState<Result[]>();

  useEffect(() => {
    api.get<Result[]>('/movie/by-year', { year: 1986 }).then(setRows);
  }, []);

  return (
    <CardComponent id="byyr-container" className={className}>
      <>
        <HeadingComponent size={3} text="List movies by year" className="px-4" />
        <TableComponent id="byyr" rows={rows || []} headers={tableHeaders} />
      </>
    </CardComponent>
  );
};

export default MovieByYearModule;
