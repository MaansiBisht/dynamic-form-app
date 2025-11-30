import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Loader2,
  Eye,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Download,
  Trash2,
  AlertCircle,
  FileText,
} from "lucide-react";
import { api } from "@/api/client";
import type { Submission } from "@/types/form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SubmissionsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const sortOrder = (searchParams.get("sortOrder") || "desc") as "asc" | "desc";

  const [sorting, setSorting] = useState<SortingState>([
    { id: "createdAt", desc: sortOrder === "desc" },
  ]);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["submissions", page, limit, sortOrder],
    queryFn: () =>
      api.getSubmissions({
        page,
        limit,
        sortBy: "createdAt",
        sortOrder,
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: api.deleteSubmission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
    },
  });

  const updateParams = (updates: Record<string, string | number>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      newParams.set(key, String(value));
    });
    setSearchParams(newParams);
  };

  const handleSort = () => {
    const newOrder = sortOrder === "desc" ? "asc" : "desc";
    setSorting([{ id: "createdAt", desc: newOrder === "desc" }]);
    updateParams({ sortOrder: newOrder, page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    updateParams({ page: newPage });
  };

  const handleLimitChange = (newLimit: string) => {
    updateParams({ limit: newLimit, page: 1 });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this submission?")) {
      deleteMutation.mutate(id);
    }
  };

  const exportToCSV = () => {
    if (!data?.data) return;

    const headers = ["Submission ID", "Created Date", "Data"];
    const rows = data.data.map((submission) => [
      submission.id,
      new Date(submission.createdAt).toLocaleString(),
      JSON.stringify(submission.data),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `submissions_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  const columns: ColumnDef<Submission>[] = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "Submission ID",
        cell: ({ row }) => (
          <span className="font-mono text-xs">{row.original.id.slice(0, 8)}...</span>
        ),
      },
      {
        accessorKey: "createdAt",
        header: () => (
          <Button
            variant="ghost"
            onClick={handleSort}
            className="flex items-center gap-1 p-0 hover:bg-transparent"
          >
            Created Date
            {sorting[0]?.id === "createdAt" ? (
              sorting[0]?.desc ? (
                <ArrowDown className="h-4 w-4" />
              ) : (
                <ArrowUp className="h-4 w-4" />
              )
            ) : (
              <ArrowUpDown className="h-4 w-4" />
            )}
          </Button>
        ),
        cell: ({ row }) => (
          <span>{new Date(row.original.createdAt).toLocaleString()}</span>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedSubmission(row.original)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(row.original.id)}
              disabled={deleteMutation.isPending}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ),
      },
    ],
    [sorting, deleteMutation.isPending]
  );

  const table = useReactTable({
    data: data?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading submissions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center gap-4 pt-6">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <div className="text-center">
              <h3 className="font-semibold">Failed to load submissions</h3>
              <p className="text-sm text-muted-foreground">
                Unable to fetch submissions. Please try again later.
              </p>
            </div>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const pagination = data?.pagination;

  return (
    <div className="mx-auto max-w-6xl py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Submissions</CardTitle>
              <CardDescription>
                {pagination?.total || 0} total submissions
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={exportToCSV} disabled={!data?.data?.length}>
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
              <Button onClick={() => navigate("/")}>New Submission</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {data?.data?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 font-semibold">No submissions yet</h3>
              <p className="text-sm text-muted-foreground">
                Submit your first form to see it here.
              </p>
              <Button className="mt-4" onClick={() => navigate("/")}>
                Go to Form
              </Button>
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    {table.getHeaderGroups().map((headerGroup) => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <th
                            key={header.id}
                            className="px-4 py-3 text-left text-sm font-medium"
                          >
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody>
                    {table.getRowModel().rows.map((row) => (
                      <tr
                        key={row.id}
                        className="border-t transition-colors hover:bg-muted/50"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className="px-4 py-3 text-sm">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Items per page:
                  </span>
                  <Select value={String(limit)} onValueChange={handleLimitChange}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    Page {pagination?.page || 1} of {pagination?.totalPages || 1}
                  </span>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handlePageChange(page - 1)}
                      disabled={!pagination?.hasPrev}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handlePageChange(page + 1)}
                      disabled={!pagination?.hasNext}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* View Submission Dialog */}
      <Dialog
        open={!!selectedSubmission}
        onOpenChange={() => setSelectedSubmission(null)}
      >
        <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Submission Details</DialogTitle>
            <DialogDescription>
              ID: {selectedSubmission?.id}
            </DialogDescription>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-4">
              <div className="rounded-lg bg-muted p-4">
                <p className="text-xs text-muted-foreground">Created At</p>
                <p className="font-medium">
                  {new Date(selectedSubmission.createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium">Form Data</p>
                <div className="space-y-2">
                  {Object.entries(selectedSubmission.data).map(([key, value]) => (
                    <div key={key} className="rounded-lg border p-3">
                      <p className="text-xs font-medium text-muted-foreground capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </p>
                      <p className="mt-1">
                        {Array.isArray(value)
                          ? value.join(", ")
                          : typeof value === "boolean"
                          ? value
                            ? "Yes"
                            : "No"
                          : String(value) || "-"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
