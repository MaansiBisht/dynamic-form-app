const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
}

export const api = {
  getFormSchema: () => fetchApi<import('../types/form').FormSchema>('/api/form-schema'),
  
  submitForm: (data: Record<string, unknown>) =>
    fetchApi<import('../types/form').SubmissionResponse>('/api/submissions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  getSubmissions: (params: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
  }) => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set('page', String(params.page));
    if (params.limit) searchParams.set('limit', String(params.limit));
    if (params.sortBy) searchParams.set('sortBy', params.sortBy);
    if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);
    if (params.search) searchParams.set('search', params.search);
    
    return fetchApi<import('../types/form').SubmissionsResponse>(
      `/api/submissions?${searchParams.toString()}`
    );
  },
  
  getSubmission: (id: string) =>
    fetchApi<{ success: boolean; data: import('../types/form').Submission }>(
      `/api/submissions/${id}`
    ),
  
  updateSubmission: (id: string, data: Record<string, unknown>) =>
    fetchApi<{ success: boolean; data: import('../types/form').Submission }>(
      `/api/submissions/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    ),
  
  deleteSubmission: (id: string) =>
    fetchApi<{ success: boolean; message: string }>(`/api/submissions/${id}`, {
      method: 'DELETE',
    }),
};
