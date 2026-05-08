import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Download, Pencil, Calendar, User } from "lucide-react";
import { AppLayout, Tag, type FilterState } from "@/components/AppLayout";
import { getDoc } from "@/lib/ikms-store";

export const Route = createFileRoute("/document/$id")({
  component: DocDetail,
  notFoundComponent: () => (
    <div className="p-12 text-center">
      <h1 className="text-2xl font-bold mb-2">Document not found</h1>
      <Link to="/" className="text-primary hover:underline">Back to dashboard</Link>
    </div>
  ),
});

function DocDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const doc = getDoc(id);
  const [filters, setFilters] = useState<FilterState>({ categories: new Set(), departments: new Set() });

  if (!doc) {
    return (
      <AppLayout filters={filters} onFiltersChange={setFilters}>
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold mb-2">Document not found</h1>
          <Link to="/" className="text-primary hover:underline">Back to dashboard</Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout filters={filters} onFiltersChange={setFilters}>
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate({ to: "/" })}
          className="inline-flex items-center gap-2 text-primary font-semibold mb-6 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <article className="bg-card rounded-lg border shadow-sm p-8">
          <h1 className="text-3xl font-bold tracking-tight mb-4">{doc.title}</h1>

          <div className="flex flex-wrap gap-2 mb-5">
            <Tag>{doc.category}</Tag>
            <Tag>{doc.department}</Tag>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground border-y py-3 mb-6">
            <span className="inline-flex items-center gap-2"><Calendar className="h-4 w-4" /> Uploaded {doc.uploadedAt}</span>
            <span className="inline-flex items-center gap-2"><User className="h-4 w-4" /> By {doc.uploadedBy}</span>
          </div>

          <div className="prose prose-sm max-w-none mb-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">Description</h3>
            <p className="text-foreground leading-relaxed">{doc.description}</p>
          </div>

          {doc.tags.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {doc.tags.map((t) => <Tag key={t}>{t}</Tag>)}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button className="inline-flex items-center gap-2 h-10 px-5 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition">
              <Download className="h-4 w-4" /> Download
            </button>
            <button className="inline-flex items-center gap-2 h-10 px-5 rounded-md border-2 border-primary text-primary text-sm font-semibold hover:bg-primary/5 transition">
              <Pencil className="h-4 w-4" /> Edit
            </button>
          </div>
        </article>
      </div>
    </AppLayout>
  );
}
