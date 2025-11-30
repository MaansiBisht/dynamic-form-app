import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DynamicFormPage } from "@/pages/DynamicFormPage";
import { SubmissionsPage } from "@/pages/SubmissionsPage";
import { FileText, Table2 } from "lucide-react";
import { cn } from "@/lib/utils";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

function Navigation() {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center px-4">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold">Dynamic Forms</span>
        </div>
        <nav className="ml-8 flex items-center gap-1">
          <Link
            to="/"
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent",
              location.pathname === "/" && "bg-accent"
            )}
          >
            <FileText className="h-4 w-4" />
            Form
          </Link>
          <Link
            to="/submissions"
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent",
              location.pathname === "/submissions" && "bg-accent"
            )}
          >
            <Table2 className="h-4 w-4" />
            Submissions
          </Link>
        </nav>
      </div>
    </header>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <Navigation />
          <main className="container mx-auto px-4">
            <Routes>
              <Route path="/" element={<DynamicFormPage />} />
              <Route path="/submissions" element={<SubmissionsPage />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
