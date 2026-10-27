declare module '@easyops-cn/docusaurus-search-local/dist/client/client/theme/searchByWorker' {
  export function searchByWorker(baseUrl: string, context: string | undefined, input: string, limit: number): Promise<Array<{ document: { t: string; u: string }; page?: { t: string } }>>;
}
