export type ListResponse<T> = {
  data: T;
  meta: {
    nextCursor: number | null;
  };
};

export function createListResponse<T>(
  data: T,
  nextCursor: number | null
): ListResponse<T> {
  return {
    data,
    meta: {
      nextCursor,
    },
  };
}
