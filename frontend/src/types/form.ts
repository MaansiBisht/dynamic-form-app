export interface FormFieldOption {
  value: string;
  label: string;
}

export interface FormFieldValidation {
  minLength?: number;
  maxLength?: number;
  regex?: string;
  regexMessage?: string;
  min?: number;
  max?: number;
  minDate?: string;
  minSelected?: number;
  maxSelected?: number;
}

export interface FormField {
  id: string;
  type: 'text' | 'number' | 'select' | 'multi-select' | 'date' | 'textarea' | 'switch';
  label: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  options?: FormFieldOption[];
  validation?: FormFieldValidation;
}

export interface FormSchema {
  title: string;
  description: string;
  fields: FormField[];
}

export interface Submission {
  id: string;
  data: Record<string, unknown>;
  createdAt: string;
  updatedAt?: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface SubmissionsResponse {
  success: boolean;
  data: Submission[];
  pagination: PaginationInfo;
}

export interface SubmissionResponse {
  success: boolean;
  id?: string;
  createdAt?: string;
  errors?: Record<string, string>;
  error?: string;
}
