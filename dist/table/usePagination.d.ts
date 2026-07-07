/**
 * Client-side pagination over an already filtered+sorted array. Deliberately
 * page-based (not virtualized/infinite-scroll) — see rbe-ui's README: no
 * runtime dependency is introduced anywhere in this library, and page-based
 * pagination composes cleanly with sticky header/columns. Filtering/sorting
 * stay memoized upstream (useSort), so this stays cheap even as row counts grow
 * well past today's volumes.
 */
export declare function usePagination<T>(rows: T[], pageSizeOptions?: number[], defaultPageSize?: number): {
    page: number;
    setPage: import("react").Dispatch<import("react").SetStateAction<number>>;
    pageSize: number;
    setPageSize: (n: number) => void;
    pageCount: number;
    pageRows: T[];
    pageSizeOptions: number[];
};
