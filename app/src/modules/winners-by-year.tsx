import * as React from 'react';
import HeadingComponent from '../components/heading';
import TableComponent from '../components/table';
import { useEffect, useState } from 'react';
import CardComponent from '../components/card';
import api from '../services/api';

interface Result {
  year: string;
  winners: number;
}

interface WinnersByYearProps {
  className?: string;
}

const WinnersByYearModule: React.FC<WinnersByYearProps> = ({ className }) => {
  const [rows, setRows] = useState<Result[]>([]);

  useEffect(() => {
    api.get<Result[]>('/winners/by-year', { limit: 3 }).then(setRows);
  }, []);

  return (
    <CardComponent id="enyr-container" className={className}>
      <>
        <HeadingComponent text="List years with multiple winners" className="px-4" />
        <TableComponent id="enyr" rows={rows || []} headers={{ year: 'Year', winners: 'Win count' }} />
      </>
    </CardComponent>
  );
};

export default WinnersByYearModule;
