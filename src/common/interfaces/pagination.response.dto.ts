export interface IDataWithPagination<T = any> {
  data: T[];

  total: number;

  page: number;

  perPage: number;

  totalPage: number;
}
