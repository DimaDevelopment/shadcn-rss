type WithCursorPaginationRespone<T> = {
  data: T;
  nextCursor: number | null;
};

export async function withCursorPagination<R extends { id: number }[]>(
  query: (...args: any[]) => Promise<R>
): Promise<WithCursorPaginationRespone<R>> {
  const result = await query();

  if (!Array.isArray(result)) {
    return { data: result, nextCursor: null };
  }

  if (!result) {
    return { data: result, nextCursor: null };
  }

  const nextCursor = result.length ? result[result.length - 1]!.id : null;

  return {
    data: result,
    nextCursor,
  };
}
