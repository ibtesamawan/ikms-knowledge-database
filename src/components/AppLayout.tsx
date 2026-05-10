import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Search, LayoutDashboard, Upload, Database } from "lucide-react";
import { CATEGORIES, DEPARTMENTS, type Category, type Department } from "@/lib/ikms-store";
import { Checkbox } from "@/components/ui/checkbox";

export interface FilterState {
  categories: Set<Category>;
  departments: Set<Department>;
}

interface Props {
  children: ReactNode;
  filters?: FilterState;
  onFiltersChange?: (f: FilterState) => void;
  showFilters?: boolean;
}

export function AppLayout({ children, filters, onFiltersChange, showFilters = true }: Props) {
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [query, setQuery] = useState("");

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/search", search: { q: query } });
  };

  const toggle = <T extends string>(set: Set<T>, val: T): Set<T> => {
    const next = new Set(set);
    next.has(val) ? next.delete(val) : next.add(val);
    return next;
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b bg-white">
        <div className="flex items-center gap-4 px-6 py-3">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <Database className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold tracking-tight">Knowledge Database</span>
          </Link>
          <form onSubmit={submitSearch} className="flex flex-1 max-w-2xl mx-auto gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search documents, tags, departments..."
                className="w-full h-10 pl-9 pr-3 rounded-md border border-input bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <button type="submit" className="h-10 px-5 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition">
              Search
            </button>
          </form>
          <nav className="flex items-center gap-1 shrink-0">
            <Link to="/" className={`px-3 h-10 inline-flex items-center gap-2 rounded-md text-sm font-medium ${path === "/" ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"}`}>
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </Link>
            <Link to="/upload" className={`px-3 h-10 inline-flex items-center gap-2 rounded-md text-sm font-medium ${path === "/upload" ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"}`}>
              <Upload className="h-4 w-4" /> Upload
            </Link>
          </nav>
        </div>
      </header>

      <div className="flex">
        {showFilters && filters && onFiltersChange && (
          <aside className="w-64 shrink-0 bg-white border-r min-h-[calc(100vh-65px)] p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Category</h3>
            <div className="space-y-2 mb-6">
              {CATEGORIES.map((c) => (
                <label key={c} className="flex items-center gap-2 text-sm cursor-pointer">
                  <Checkbox
                    checked={filters.categories.has(c)}
                    onCheckedChange={() => onFiltersChange({ ...filters, categories: toggle(filters.categories, c) })}
                  />
                  {c}
                </label>
              ))}
            </div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Department</h3>
            <div className="space-y-2">
              {DEPARTMENTS.map((d) => (
                <label key={d} className="flex items-center gap-2 text-sm cursor-pointer">
                  <Checkbox
                    checked={filters.departments.has(d)}
                    onCheckedChange={() => onFiltersChange({ ...filters, departments: toggle(filters.departments, d) })}
                  />
                  {d}
                </label>
              ))}
            </div>
            {(filters.categories.size > 0 || filters.departments.size > 0) && (
              <button
                onClick={() => onFiltersChange({ categories: new Set(), departments: new Set() })}
                className="mt-6 text-xs text-primary hover:underline"
              >
                Clear all filters
              </button>
            )}
          </aside>
        )}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-primary text-primary-foreground text-xs font-medium">
      {children}
    </span>
  );
}
