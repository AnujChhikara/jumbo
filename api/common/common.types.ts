export type TApiResponse<T> = {
  data: T;
  message: string;
};

export type TApiMethodsRecord = Record<
  string,
  {
    key: string[];
    fn: () => Promise<any>;
  }
>;

export type TApiError = {
  message: string;
  status: number;
  code?: string;
};
