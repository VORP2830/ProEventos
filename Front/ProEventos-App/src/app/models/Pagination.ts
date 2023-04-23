export class Pagination {
  currentPage!: number;
  itemsPerPages!: number;
  totalItems!: number;
  totalPages!: number;
}

export class PaginationResult<T> {
  result!: T;
  pagination!: Pagination;
}
