"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { urlApi, parseError } from "@/lib/api";
import type { UrlStats, ApiError } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorMessage } from "@/components/error-message";
import {
  ArrowLeft,
  BarChart3,
  ExternalLink,
  Clock,
  Globe,
  Monitor,
} from "lucide-react";

export default function UrlStatsPage() {
  const params = useParams();
  const code = params.code as string;
  const [stats, setStats] = React.useState<UrlStats | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchStats() {
      try {
        const data = await urlApi.getStats(code);
        setStats(data);
      } catch (err) {
        setError(parseError(err as ApiError));
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, [code]);

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-screen-lg px-4 py-8">
        <Skeleton className="h-8 w-48 mb-8" />
        <Skeleton className="h-40 w-full mb-4" />
        <Skeleton className="h-60 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-screen-lg px-4 py-8">
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
        <ErrorMessage message={error} />
      </div>
    );
  }

  if (!stats) return null;

  const isExpired = stats.expiresAt && new Date(stats.expiresAt) < new Date();

  return (
    <div className="container mx-auto max-w-screen-lg px-4 py-8">
      <Link href="/dashboard">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </Link>

      {/* URL Info Card */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {stats.shortUrl}
                {isExpired && <Badge variant="destructive">Expired</Badge>}
              </CardTitle>
              <CardDescription className="mt-1 break-all">
                {stats.originalUrl}
              </CardDescription>
            </div>
            <a href={stats.shortUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </a>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <StatBox
              icon={<BarChart3 className="h-5 w-5" />}
              label="Total Clicks"
              value={stats.clickCount.toString()}
            />
            <StatBox
              icon={<Clock className="h-5 w-5" />}
              label="Created"
              value={new Date(stats.createdAt).toLocaleDateString()}
            />
            <StatBox
              icon={<Clock className="h-5 w-5" />}
              label="Expires"
              value={
                stats.expiresAt
                  ? new Date(stats.expiresAt).toLocaleDateString()
                  : "Never"
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Recent Clicks Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Clicks</CardTitle>
          <CardDescription>Last 10 clicks on this link</CardDescription>
        </CardHeader>
        <CardContent>
          {stats.recentClicks.length === 0 ? (
            <p className="text-center py-8 text-[hsl(var(--muted-foreground))]">
              No clicks recorded yet
            </p>
          ) : (
            <div className="space-y-3">
              {stats.recentClicks.map((click, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 rounded-lg bg-[hsl(var(--muted))]"
                >
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                    {new Date(click.clickedAt).toLocaleString()}
                  </div>
                  {click.referer && (
                    <div className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
                      <Globe className="h-4 w-4" />
                      <span className="truncate max-w-[200px]">
                        {click.referer}
                      </span>
                    </div>
                  )}
                  {click.userAgent && (
                    <div className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
                      <Monitor className="h-4 w-4" />
                      <span className="truncate max-w-[300px]">
                        {parseUserAgent(click.userAgent)}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatBox({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-[hsl(var(--border))] p-4">
      <div className="text-[hsl(var(--muted-foreground))]">{icon}</div>
      <div>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">{label}</p>
        <p className="text-xl font-semibold">{value}</p>
      </div>
    </div>
  );
}

function parseUserAgent(ua: string): string {
  if (ua.includes("Chrome")) return "Chrome";
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Safari")) return "Safari";
  if (ua.includes("Edge")) return "Edge";
  return ua.slice(0, 50);
}
