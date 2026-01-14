"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { urlApi, parseError } from "@/lib/api";
import type { Url, ApiError } from "@/types";
import { UrlForm } from "@/components/url-form";
import { UrlCard } from "@/components/url-card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/sonner";
import { Link2 } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [urls, setUrls] = React.useState<Url[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  const fetchUrls = React.useCallback(async () => {
    try {
      const data = await urlApi.getMyUrls();
      setUrls(data);
    } catch (error) {
      toast.error(parseError(error as ApiError));
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (isAuthenticated) {
      fetchUrls();
    }
  }, [isAuthenticated, fetchUrls]);

  const handleDelete = async (code: string) => {
    try {
      await urlApi.delete(code);
      setUrls((prev) => prev.filter((u) => u.shortCode !== code));
      toast.success("URL deleted successfully");
    } catch (error) {
      toast.error(parseError(error as ApiError));
    }
  };

  const handleUrlCreated = (newUrl: Url) => {
    setUrls((prev) => [newUrl, ...prev]);
  };

  if (authLoading) {
    return (
      <div className="container mx-auto max-w-screen-xl px-4 py-8">
        <Skeleton className="h-8 w-48 mb-8" />
        <Skeleton className="h-40 w-full mb-8" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-screen-xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* URL Form */}
      <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Create a new short link</h2>
        <UrlForm onSuccess={handleUrlCreated} />
      </div>

      {/* URLs List */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Your Links</h2>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))}
          </div>
        ) : urls.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-[hsl(var(--border))] rounded-xl">
            <Link2 className="h-12 w-12 mx-auto text-[hsl(var(--muted-foreground))] mb-4" />
            <p className="text-[hsl(var(--muted-foreground))]">
              No links yet. Create your first short link above!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {urls.map((url) => (
              <UrlCard
                key={url.shortCode}
                url={url}
                onDelete={() => handleDelete(url.shortCode)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
