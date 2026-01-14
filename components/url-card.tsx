"use client";

import * as React from "react";
import Link from "next/link";
import type { Url } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";
import {
  Copy,
  ExternalLink,
  Trash2,
  BarChart3,
  Clock,
  CheckCircle,
} from "lucide-react";

interface UrlCardProps {
  url: Url;
  onDelete?: () => void;
  showDelete?: boolean;
}

export function UrlCard({ url, onDelete, showDelete = true }: UrlCardProps) {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url.shortUrl);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const isExpired = url.expiresAt && new Date(url.expiresAt) < new Date();

  return (
    <Card className="group transition-shadow hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <a
                href={url.shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[hsl(var(--primary))] hover:underline truncate"
              >
                {url.shortUrl}
              </a>
              {isExpired && (
                <Badge variant="destructive" className="text-xs">
                  Expired
                </Badge>
              )}
            </div>
            <p className="text-sm text-[hsl(var(--muted-foreground))] truncate">
              {url.originalUrl}
            </p>
            <div className="flex items-center gap-4 text-xs text-[hsl(var(--muted-foreground))]">
              <span className="flex items-center gap-1">
                <BarChart3 className="h-3 w-3" />
                {url.clickCount} click{url.clickCount !== 1 ? "s" : ""}
              </span>
              {url.expiresAt && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(url.expiresAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              className="gap-1"
            >
              {copied ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">
                {copied ? "Copied" : "Copy"}
              </span>
            </Button>
            <Link href={`/urls/${url.shortCode}/stats`}>
              <Button variant="outline" size="sm" className="gap-1">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Stats</span>
              </Button>
            </Link>
            <a href={url.shortUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </a>
            {showDelete && onDelete && (
              <Button
                variant="outline"
                size="sm"
                onClick={onDelete}
                className="text-[hsl(var(--destructive))] hover:bg-[hsl(var(--destructive))] hover:text-white"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
