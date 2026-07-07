import { useState, useMemo, useEffect } from 'react';
/**
 * Client-side pagination over an already filtered+sorted array. Deliberately
 * page-based (not virtualized/infinite-scroll) — see rbe-ui's README: no
 * runtime dependency is introduced anywhere in this library, and page-based
 * pagination composes cleanly with sticky header/columns. Filtering/sorting
 * stay memoized upstream (useSort), so this stays cheap even as row counts grow
 * well past today's volumes.
 */
export function usePagination(rows, pageSizeOptions = [25, 50, 100], defaultPageSize = 25) {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSizeState] = useState(defaultPageSize);
    const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
    // Clamp when the current page no longer exists (e.g. page size grew, or the
    // filtered set shrank while on a late page).
    useEffect(() => {
        if (page > pageCount)
            setPage(pageCount);
    }, [pageCount, page]);
    // A change in the filtered row count means the caller's filter/search changed
    // underneath us — jump back to page 1 rather than show a stale, unrelated slice.
    useEffect(() => {
        setPage(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rows.length]);
    const pageRows = useMemo(() => {
        const start = (page - 1) * pageSize;
        return rows.slice(start, start + pageSize);
    }, [rows, page, pageSize]);
    function setPageSize(n) {
        setPageSizeState(n);
        setPage(1);
    }
    return { page, setPage, pageSize, setPageSize, pageCount, pageRows, pageSizeOptions };
}
