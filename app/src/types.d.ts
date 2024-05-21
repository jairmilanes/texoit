interface DataLoadResult<T> {
  error?: Error;
  data?: T;
}

export interface FormState {
  options: 'people' | 'films';
  query: string;
}

export interface Movie {
  id: number;
  year: string;
  title: string;
  studios: string;
  producers: string;
  winner: string;
}

export interface SearchResult {
  items: Movie[];
  page: number;
  pages: number;
  count: number;
  next: number | null;
  prev: number | null;
  limit: number | null;
  offset: number | null;
}

export interface GenericeRecord {
  [key: string]: strin | number | boolean | undefined;
}

export interface SearchQuery extends GenericeRecord {
  q?: string;
  year?: string;
  page?: number;
  winner?: 'yes' | 'no';
}
