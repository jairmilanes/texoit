import React, { useCallback, useEffect, useState } from 'react';
import { navigate } from 'gatsby';
import * as queryString from 'query-string';
import { useLocation } from '@reach/router';

function parseSearch<T>(search: string) {
  return queryString.parse(search) as unknown as T;
}

export function useQuery<T>(defaults: Partial<T> = {}): [Partial<T>, (params: Partial<T>) => void] {
  const location = useLocation();
  const [query, setQuery] = useState<Partial<T>>({
    ...parseSearch<T>(location.search),
    ...defaults,
  });

  useEffect(() => {
    setQuery(parseSearch<T>(location.search));
  }, [setQuery, location]);

  const pushState = useCallback(async (params: Partial<T>) => {
    await navigate(`?${queryString.stringify(params)}`);
  }, []);

  return [query, pushState];
}
