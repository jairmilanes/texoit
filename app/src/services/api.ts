import { GenericeRecord } from '../types';

export class ApiService {
  baseUrl = 'http://localhost:3131';

  setBaseUrl(base: string) {
    this.baseUrl = base;
  }

  url = (path: string) => {
    return new URL(this.baseUrl + path.replace(this.baseUrl, ''));
  };

  async get<T>(path: string, params: GenericeRecord): Promise<T> {
    const url = this.url(path);

    Object.keys(params).forEach((key) => {
      url.searchParams.set(key, params[key]);
    });

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
        },
      });

      return response.json();
    } catch (e) {
      console.log(e);

      throw e;
    }
  }
}

export default new ApiService();
