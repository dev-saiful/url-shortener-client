"use client";

import * as React from "react";
import { UrlForm } from "@/components/url-form";
import { UrlCard } from "@/components/url-card";
import type { Url } from "@/types";
import { Link2, Zap, BarChart3, Shield } from "lucide-react";

export default function HomePage() {
  const [recentUrl, setRecentUrl] = React.useState<Url | null>(null);

  return (
    <div className="container mx-auto max-w-screen-xl px-4 py-12">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-4">
          Shorten Your Links,
          <br />
          <span className="text-[hsl(var(--muted-foreground))]">
            Expand Your Reach
          </span>
        </h1>
        <p className="text-lg text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto">
          Fast, reliable URL shortening with detailed analytics. Create custom
          branded links and track every click.
        </p>
      </section>

      {/* URL Form */}
      <section className="max-w-2xl mx-auto mb-8">
        <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 sm:p-8 shadow-sm">
          <UrlForm onSuccess={setRecentUrl} />
        </div>
      </section>

      {/* Recent URL Result */}
      {recentUrl && (
        <section className="max-w-2xl mx-auto mb-12">
          <h2 className="text-sm font-medium text-[hsl(var(--muted-foreground))] mb-3">
            Your shortened link:
          </h2>
          <UrlCard url={recentUrl} showDelete={false} />
        </section>
      )}

      {/* Features Grid */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-16">
        <FeatureCard
          icon={<Link2 className="h-6 w-6" />}
          title="Custom Links"
          description="Create branded short links with custom codes"
        />
        <FeatureCard
          icon={<Zap className="h-6 w-6" />}
          title="Lightning Fast"
          description="Redis-powered redirects for instant access"
        />
        <FeatureCard
          icon={<BarChart3 className="h-6 w-6" />}
          title="Analytics"
          description="Track clicks, referrers, and user agents"
        />
        <FeatureCard
          icon={<Shield className="h-6 w-6" />}
          title="Secure"
          description="JWT auth and role-based access control"
        />
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-[hsl(var(--border))] p-6 text-center">
      <div className="inline-flex items-center justify-center rounded-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] p-3 mb-4">
        {icon}
      </div>
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-[hsl(var(--muted-foreground))]">
        {description}
      </p>
    </div>
  );
}
