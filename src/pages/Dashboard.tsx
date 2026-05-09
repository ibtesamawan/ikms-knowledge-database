import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { AppLayout, Tag, type FilterState } from "@/components/AppLayout";
import { useDocs, CATEGORIES, type Category } from "@/lib/ikms-store";

export default function Dashboard() {
  const docs = useDocs();
  const [filters, setFilters] = useState<FilterState>({ categories: new Set(), departments: new Set() });

  const filtered = useMemo(() => {
    return docs.filter((d) => {
      if (filters.categories.size && !filters.categories.has(d.category)) return false;
      if (filters.departments.size && !filters.departments.has(d.department)) return false;
      return true;
    });
  }, [docs, filters]);

  const grouped = useMemo(() => {
    const map = new Map<Category, typeof filtered>();
    CATEGORIES.forEach((c) => map.set(c, []));
    filtered.forEach((d) => map.get(d.category)!.push(d));
    return map;
  }, [filtered]);

  return (
    <AppLayout filters={filters} onFiltersChange={setFilters}>
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Browse the organizational knowledge base.</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-primary">{filtered.length}</div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Total Documents</div>
        </div>
      </div>

      {Array.from(grouped.entries()).map(([cat, list]) =>
        list.length ? (
          <section key={cat} className="mb-10">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b">{cat}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {list.map((d) => (
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
          </section>
        ) : null
      )}

      {filtered.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">No documents match the selected filters.</div>
      )}
    </AppLayout>
  );
}
