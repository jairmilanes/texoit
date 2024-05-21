import * as React from 'react';
import { DEFAULT_SEARCH_TYPE } from './constants';
import { Context } from './types';

export const DefaultContext = React.createContext<Context>({
  searching: false,
  searchType: DEFAULT_SEARCH_TYPE,
});
