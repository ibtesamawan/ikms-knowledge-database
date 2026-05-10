import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { SearchX } from "lucide-react";
import { AppLayout, Tag, type FilterState } from "@/components/AppLayout";
import { useDocs } from "@/lib/ikms-store";

export default function SearchPage() {
  useEffect(() => { document.title = "Search — IKMS"; }, []);
  const [params] = useSearchParams();
  const q = params.get("q") ?? "";
  const docs = useDocs();
  const [filters, setFilters] = useState<FilterState>({ categories: new Set(), departments: new Set() });

  const results = useMemo(() => {
    const needle = q.toLowerCase().trim();
    return docs.filter((d) => {
      if (filters.categories.size && !filters.categories.has(d.category)) return false;
      if (!needle) return true;
      return (
        d.title.toLowerCase().includes(needle) ||
        d.description.toLowerCase().includes(needle) ||
        d.category.toLowerCase().includes(needle) ||
        d.department.toLowerCase().includes(needle) ||
        d.tags.some((t) => t.toLowerCase().includes(needle))
      );
    });
  }, [docs, q, filters]);

  return (
    <AppLayout filters={filters} onFiltersChange={setFilters}>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Search Results</h1>
        <p className="text-muted-foreground mt-1">
          {q ? <>Showing results for <span className="font-semibold text-foreground">"{q}"</span> — {results.length} found</> : `${results.length} documents`}
        </p>
      </div>

      {results.length === 0 ? (
        <div className="text-center py-24 bg-card rounded-lg border">
          <SearchX className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-bold mb-1">No Results Found</h2>
          <p className="text-muted-foreground">Try a different search term or clear your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {results.map((d) => (
            <article key={d.id} className="bg-card rounded-lg border shadow-sm hover:shadow-md transition p-5 flex flex-col">
              <h3 className="font-bold text-base leading-snug mb-2">{d.title}</h3>
              <div className="flex flex-wrap gap-2 mb-3">
                <Tag>{d.category}</Tag>
                <Tag>{d.department}</Tag>
              </div>
              <p className="text-sm text-muted-foreground flex-1 mb-4">{d.description}</p>
              <Link
                to={`/document/${d.id}`}
                className="inline-flex items-center justify-center h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition self-start"
              >
                View Details
              </Link>
            </article>
          ))}
        </div>
      )}
    </AppLayout>
  );
}
