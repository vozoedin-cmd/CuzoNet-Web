
// Basic fetch client
export const apiClient = {
  async get<T>(url: string): Promise<T> {
    const res = await fetch(`/api${url}`);
    if (!res.ok) {
      throw new Error(`Error fetching ${url}: ${res.statusText}`);
    }
    return res.json() as Promise<T>;
  }
};
