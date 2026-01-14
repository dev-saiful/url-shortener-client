"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { adminApi, parseError } from "@/lib/api";
import type { AdminUrl, AdminUser, ApiError } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Link2,
  Users,
  Trash2,
  MoreVertical,
  Shield,
  User,
  ExternalLink,
  BarChart3,
} from "lucide-react";

export default function AdminPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  React.useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push("/login");
      } else if (user?.role !== "ADMIN") {
        router.push("/dashboard");
        toast.error("Access denied. Admin privileges required.");
      }
    }
  }, [authLoading, isAuthenticated, user, router]);

  if (authLoading || !user || user.role !== "ADMIN") {
    return (
      <div className="container mx-auto max-w-screen-xl px-4 py-8">
        <Skeleton className="h-8 w-48 mb-8" />
        <Skeleton className="h-10 w-72 mb-4" />
        <Skeleton className="h-60 w-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-screen-xl px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Shield className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Admin Panel</h1>
      </div>

      <Tabs defaultValue="urls">
        <TabsList className="mb-6">
          <TabsTrigger value="urls" className="gap-2">
            <Link2 className="h-4 w-4" />
            URLs
          </TabsTrigger>
          <TabsTrigger value="users" className="gap-2">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
        </TabsList>

        <TabsContent value="urls">
          <UrlsTab />
        </TabsContent>
        <TabsContent value="users">
          <UsersTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function UrlsTab() {
  const [urls, setUrls] = React.useState<AdminUrl[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [page, setPage] = React.useState(1);

  const fetchUrls = React.useCallback(async () => {
    try {
      const data = await adminApi.getAllUrls(page, 20);
      setUrls(data);
    } catch (error) {
      toast.error(parseError(error as ApiError));
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  React.useEffect(() => {
    fetchUrls();
  }, [fetchUrls]);

  const handleDelete = async (code: string) => {
    try {
      await adminApi.deleteUrl(code);
      setUrls((prev) => prev.filter((u) => u.shortCode !== code));
      toast.success("URL deleted successfully");
    } catch (error) {
      toast.error(parseError(error as ApiError));
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All URLs</CardTitle>
        <CardDescription>Manage all shortened URLs in the system</CardDescription>
      </CardHeader>
      <CardContent>
        {urls.length === 0 ? (
          <p className="text-center py-8 text-[hsl(var(--muted-foreground))]">
            No URLs found
          </p>
        ) : (
          <div className="space-y-3">
            {urls.map((url) => (
              <div
                key={url.shortCode}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border border-[hsl(var(--border))]"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <a
                      href={url.shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-[hsl(var(--primary))] hover:underline"
                    >
                      {url.shortCode}
                    </a>
                    <Badge variant="secondary" className="text-xs">
                      <BarChart3 className="h-3 w-3 mr-1" />
                      {url.clickCount}
                    </Badge>
                    {url.user && (
                      <Badge variant="outline" className="text-xs">
                        {url.user.email}
                      </Badge>
                    )}
                    {!url.user && (
                      <Badge variant="outline" className="text-xs">
                        Anonymous
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-[hsl(var(--muted-foreground))] truncate mt-1">
                    {url.originalUrl}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <a href={url.shortUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </a>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(url.shortCode)}
                    className="text-[hsl(var(--destructive))]"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center gap-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={urls.length < 20}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function UsersTab() {
  const [users, setUsers] = React.useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [page, setPage] = React.useState(1);

  const fetchUsers = React.useCallback(async () => {
    try {
      const data = await adminApi.getAllUsers(page, 20);
      setUsers(data);
    } catch (error) {
      toast.error(parseError(error as ApiError));
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  React.useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleUpdate = async (
    userId: string,
    role: "USER" | "ADMIN"
  ) => {
    try {
      const updated = await adminApi.updateUserRole(userId, { role });
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: updated.role } : u))
      );
      toast.success("User role updated");
    } catch (error) {
      toast.error(parseError(error as ApiError));
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Users</CardTitle>
        <CardDescription>Manage user accounts and roles</CardDescription>
      </CardHeader>
      <CardContent>
        {users.length === 0 ? (
          <p className="text-center py-8 text-[hsl(var(--muted-foreground))]">
            No users found
          </p>
        ) : (
          <div className="space-y-3">
            {users.map((u) => (
              <div
                key={u.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border border-[hsl(var(--border))]"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-[hsl(var(--muted))] flex items-center justify-center">
                    {u.role === "ADMIN" ? (
                      <Shield className="h-5 w-5" />
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{u.name || u.email}</p>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">
                      {u.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant={u.role === "ADMIN" ? "default" : "secondary"}
                  >
                    {u.role}
                  </Badge>
                  <Badge variant="outline">{u.urlCount} URLs</Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {u.role === "USER" ? (
                        <DropdownMenuItem
                          onClick={() => handleRoleUpdate(u.id, "ADMIN")}
                        >
                          <Shield className="mr-2 h-4 w-4" />
                          Make Admin
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          onClick={() => handleRoleUpdate(u.id, "USER")}
                        >
                          <User className="mr-2 h-4 w-4" />
                          Remove Admin
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center gap-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={users.length < 20}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
