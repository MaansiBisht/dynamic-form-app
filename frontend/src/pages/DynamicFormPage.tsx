import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "react-router-dom";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { api } from "@/api/client";
import type { FormField, FormSchema } from "@/types/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";

export function DynamicFormPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const {
    data: schema,
    isLoading: schemaLoading,
    error: schemaError,
  } = useQuery<FormSchema>({
    queryKey: ["form-schema"],
    queryFn: api.getFormSchema,
  });

  const submitMutation = useMutation({
    mutationFn: api.submitForm,
    onSuccess: (data) => {
      if (data.success) {
        setSubmitStatus({
          type: "success",
          message: "Form submitted successfully!",
        });
        queryClient.invalidateQueries({ queryKey: ["submissions"] });
        form.reset();
        setTimeout(() => {
          navigate("/submissions");
        }, 1500);
      }
    },
    onError: (error: { errors?: Record<string, string>; error?: string }) => {
      if (error.errors) {
        Object.entries(error.errors).forEach(([field, message]) => {
          form.setFieldMeta(field, (prev) => ({
            ...prev,
            errorMap: { onChange: message },
          }));
        });
        setSubmitStatus({
          type: "error",
          message: "Please fix the validation errors below.",
        });
      } else {
        setSubmitStatus({
          type: "error",
          message: error.error || "An error occurred while submitting the form.",
        });
      }
    },
  });

  const form = useForm({
    defaultValues: getDefaultValues(schema?.fields || []),
    onSubmit: async ({ value }) => {
      setSubmitStatus({ type: null, message: "" });
      submitMutation.mutate(value);
    },
  });

  if (schemaLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading form schema...</p>
        </div>
      </div>
    );
  }

  if (schemaError || !schema) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center gap-4 pt-6">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <div className="text-center">
              <h3 className="font-semibold">Failed to load form</h3>
              <p className="text-sm text-muted-foreground">
                Unable to fetch the form schema. Please try again later.
              </p>
            </div>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{schema.title}</CardTitle>
          <CardDescription>{schema.description}</CardDescription>
        </CardHeader>
        <CardContent>
          {submitStatus.type && (
            <div
              className={`mb-6 flex items-center gap-2 rounded-lg p-4 ${
                submitStatus.type === "success"
                  ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                  : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
              }`}
            >
              {submitStatus.type === "success" ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}
              <span>{submitStatus.message}</span>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-6"
          >
            {schema.fields.map((field) => (
              <FormFieldComponent key={field.id} field={field} form={form} />
            ))}

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={submitMutation.isPending}
                className="flex-1"
              >
                {submitMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {submitMutation.isPending ? "Submitting..." : "Submit"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/submissions")}
              >
                View Submissions
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function getDefaultValues(fields: FormField[]): Record<string, unknown> {
  const defaults: Record<string, unknown> = {};
  for (const field of fields) {
    switch (field.type) {
      case "text":
      case "textarea":
      case "date":
        defaults[field.id] = "";
        break;
      case "number":
        defaults[field.id] = "";
        break;
      case "select":
        defaults[field.id] = "";
        break;
      case "multi-select":
        defaults[field.id] = [];
        break;
      case "switch":
        defaults[field.id] = false;
        break;
    }
  }
  return defaults;
}

interface FormFieldComponentProps {
  field: FormField;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any;
}

function FormFieldComponent({ field, form }: FormFieldComponentProps) {
  return (
    <form.Field
      name={field.id}
      validators={{
        onChange: ({ value }: { value: unknown }) => validateField(field, value),
      }}
    >
      {(fieldApi: { state: { value: unknown; meta: { errors?: string[] } }; handleChange: (value: unknown) => void; handleBlur: () => void }) => {
        const error = fieldApi.state.meta.errors?.[0];

        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor={field.id} className="text-sm font-medium">
                {field.label}
                {field.required && (
                  <span className="ml-1 text-destructive">*</span>
                )}
              </Label>
            </div>

            {field.description && field.type !== "switch" && (
              <p className="text-xs text-muted-foreground">{field.description}</p>
            )}

            {renderFieldInput(field, fieldApi)}

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>
        );
      }}
    </form.Field>
  );
}

function renderFieldInput(field: FormField, fieldApi: { state: { value: unknown }; handleChange: (value: unknown) => void; handleBlur: () => void }) {
  const { type, id, placeholder, options, description } = field;

  switch (type) {
    case "text":
      return (
        <Input
          id={id}
          type="text"
          placeholder={placeholder}
          value={(fieldApi.state.value as string) || ""}
          onChange={(e) => fieldApi.handleChange(e.target.value)}
          onBlur={fieldApi.handleBlur}
        />
      );

    case "number":
      return (
        <Input
          id={id}
          type="number"
          placeholder={placeholder}
          value={(fieldApi.state.value as string) || ""}
          onChange={(e) => fieldApi.handleChange(e.target.value)}
          onBlur={fieldApi.handleBlur}
        />
      );

    case "textarea":
      return (
        <Textarea
          id={id}
          placeholder={placeholder}
          value={(fieldApi.state.value as string) || ""}
          onChange={(e) => fieldApi.handleChange(e.target.value)}
          onBlur={fieldApi.handleBlur}
          rows={4}
        />
      );

    case "date":
      return (
        <Input
          id={id}
          type="date"
          placeholder={placeholder}
          value={(fieldApi.state.value as string) || ""}
          onChange={(e) => fieldApi.handleChange(e.target.value)}
          onBlur={fieldApi.handleBlur}
        />
      );

    case "select":
      return (
        <Select
          value={(fieldApi.state.value as string) || ""}
          onValueChange={(value) => fieldApi.handleChange(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options?.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    case "multi-select":
      return (
        <MultiSelect
          options={options || []}
          value={(fieldApi.state.value as string[]) || []}
          onChange={(value) => fieldApi.handleChange(value)}
          placeholder={placeholder}
        />
      );

    case "switch":
      return (
        <div className="flex items-center gap-3">
          <Switch
            id={id}
            checked={(fieldApi.state.value as boolean) || false}
            onCheckedChange={(checked) => fieldApi.handleChange(checked)}
          />
          {description && (
            <Label htmlFor={id} className="text-sm font-normal text-muted-foreground cursor-pointer">
              {description}
            </Label>
          )}
        </div>
      );

    default:
      return null;
  }
}

function validateField(field: FormField, value: unknown): string | undefined {
  const { type, required, validation, label } = field;

  // Check required
  if (required) {
    if (value === undefined || value === null || value === "") {
      return `${label} is required`;
    }
    if (type === "multi-select" && (!Array.isArray(value) || value.length === 0)) {
      return `${label} is required`;
    }
    if (type === "switch" && value !== true) {
      return `${label} must be accepted`;
    }
  }

  // Skip further validation if value is empty and not required
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  if (!validation) return undefined;

  // Type-specific validation
  switch (type) {
    case "text":
    case "textarea": {
      const strValue = value as string;
      if (validation.minLength && strValue.length < validation.minLength) {
        return `${label} must be at least ${validation.minLength} characters`;
      }
      if (validation.maxLength && strValue.length > validation.maxLength) {
        return `${label} must be at most ${validation.maxLength} characters`;
      }
      if (validation.regex) {
        const regex = new RegExp(validation.regex);
        if (!regex.test(strValue)) {
          return validation.regexMessage || `${label} format is invalid`;
        }
      }
      break;
    }

    case "number": {
      const num = Number(value);
      if (isNaN(num)) {
        return `${label} must be a valid number`;
      }
      if (validation.min !== undefined && num < validation.min) {
        return `${label} must be at least ${validation.min}`;
      }
      if (validation.max !== undefined && num > validation.max) {
        return `${label} must be at most ${validation.max}`;
      }
      break;
    }

    case "multi-select": {
      const arrValue = value as string[];
      if (validation.minSelected && arrValue.length < validation.minSelected) {
        return `${label} must have at least ${validation.minSelected} selected`;
      }
      if (validation.maxSelected && arrValue.length > validation.maxSelected) {
        return `${label} must have at most ${validation.maxSelected} selected`;
      }
      break;
    }

    case "date": {
      const date = new Date(value as string);
      if (isNaN(date.getTime())) {
        return `${label} must be a valid date`;
      }
      if (validation.minDate === "today") {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (date < today) {
          return `${label} must be today or later`;
        }
      }
      break;
    }
  }

  return undefined;
}
