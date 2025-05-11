export function buildPaginationLinks(
    baseUrl: string,
    page: number,
    limit: number,
    total: number,
): string {
    const lastPage = Math.ceil(total / limit) || 1;
    const links: string[] = [];              // ✅

    const make = (p: number, rel: string) =>
        links.push(`<${baseUrl}?page=${p}&limit=${limit}>; rel="${rel}"`);

    make(page, 'self');
    if (page > 1) make(page - 1, 'prev');
    if (page < lastPage) make(page + 1, 'next');
    make(lastPage, 'last');

    return links.join(', ');
}
