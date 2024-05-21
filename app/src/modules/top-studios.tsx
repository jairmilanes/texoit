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

interface Top3StudiosProps {
  className?: string;
}

const Top3StudiosModule: React.FC<Top3StudiosProps> = ({ className }) => {
  const [rows, setRows] = useState<Result[]>([]);

  useEffect(() => {
    api.get<Result[]>('/studios/top-three', {}).then(setRows);
  }, []);

  return (
    <CardComponent id="tpst-container" className={className}>
      <>
        <HeadingComponent text="Top 3 studios with winners" className="px-4" />
        <TableComponent id="tpst" rows={rows || []} headers={{ studios: 'Studio', winners: 'Win count' }} />
      </>
    </CardComponent>
  );
};

export default Top3StudiosModule;
