import * as React from 'react';
import HeadingComponent from '../components/heading';
import TableComponent from '../components/table';
import { useEffect, useState } from 'react';
import CardComponent from '../components/card';
import api from '../services/api';

interface Result {
  min: Record<string, string>[];
  max: Record<string, string>[];
}

interface ProducersRangeProps {
  className?: string;
}

const tableHeaders = {
  producers: 'Producer',
  interval: 'Interval',
  previousWin: 'Previous Year',
  followingWin: 'Following Year',
};

const ProducersRangeModule: React.FC<ProducersRangeProps> = ({ className }) => {
  const [rows, setRows] = useState<Result>();

  useEffect(() => {
    api.get<Result>('/winners/range', {}).then(setRows);
  }, []);

  return (
    <CardComponent id="prmin-container" className={className}>
      <>
        <HeadingComponent text="Producers with longest and shortest interval between wins" className="px-4" />

        <HeadingComponent size={4} text="Minimum" className="px-4 bg-neutral-600" />
        <TableComponent id="prmin" rows={rows?.min || []} headers={tableHeaders} />
        <HeadingComponent size={4} text="Maximum" className="px-4 bg-neutral-600" />
        <TableComponent id="prmax" rows={rows?.max || []} headers={tableHeaders} />
      </>
    </CardComponent>
  );
};

export default ProducersRangeModule;
