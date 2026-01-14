"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { urlApi, parseError } from "@/lib/api";
import type { Url, ApiError } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { Loader2 } from "lucide-react";

const urlSchema = z.object({
  originalUrl: z.string().url("Please enter a valid URL"),
  customCode: z
    .string()
    .regex(/^[a-zA-Z0-9_-]{3,10}$/, "3-10 alphanumeric characters, underscores, or hyphens")
    .optional()
    .or(z.literal("")),
  expiresAt: z.string().optional().or(z.literal("")),
});

type UrlFormValues = z.infer<typeof urlSchema>;

interface UrlFormProps {
  onSuccess?: (url: Url) => void;
}

export function UrlForm({ onSuccess }: UrlFormProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UrlFormValues>({
    resolver: zodResolver(urlSchema),
    defaultValues: {
      originalUrl: "",
      customCode: "",
      expiresAt: "",
    },
  });

  const onSubmit = async (data: UrlFormValues) => {
    setIsLoading(true);
    try {
      const url = await urlApi.create({
        originalUrl: data.originalUrl,
        customCode: data.customCode || undefined,
        expiresAt: data.expiresAt || undefined,
      });
      toast.success("URL shortened successfully!");
      reset();
      onSuccess?.(url);
    } catch (error) {
      toast.error(parseError(error as ApiError));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="originalUrl">URL to shorten</Label>
        <Input
          id="originalUrl"
          type="url"
          placeholder="https://example.com/very-long-url"
          {...register("originalUrl")}
          className="text-base"
        />
        {errors.originalUrl && (
          <p className="text-sm text-[hsl(var(--destructive))]">
            {errors.originalUrl.message}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
      >
        {showAdvanced ? "− Hide" : "+ Show"} advanced options
      </button>

      {showAdvanced && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="customCode">Custom code (optional)</Label>
            <Input
              id="customCode"
              placeholder="my-link"
              {...register("customCode")}
            />
            {errors.customCode && (
              <p className="text-sm text-[hsl(var(--destructive))]">
                {errors.customCode.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="expiresAt">Expires at (optional)</Label>
            <Input
              id="expiresAt"
              type="datetime-local"
              {...register("expiresAt")}
            />
          </div>
        </div>
      )}

      <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Shorten URL
      </Button>
    </form>
  );
}
