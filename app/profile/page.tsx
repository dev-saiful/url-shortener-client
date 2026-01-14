"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/context/auth-context";
import { userApi, parseError } from "@/lib/api";
import type { ApiError } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/sonner";
import { Loader2 } from "lucide-react";

const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading, refreshUser } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
    },
  });

  React.useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  React.useEffect(() => {
    if (user) {
      reset({ name: user.name || "" });
    }
  }, [user, reset]);

  const onSubmit = async (data: ProfileFormValues) => {
    setIsLoading(true);
    try {
      await userApi.updateProfile(data.name);
      await refreshUser();
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(parseError(error as ApiError));
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="container mx-auto max-w-screen-md px-4 py-8">
        <Skeleton className="h-8 w-48 mb-8" />
        <Skeleton className="h-60 w-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-screen-md px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Profile</h1>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>
            Update your profile details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Read-only fields */}
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={user.email} disabled className="bg-[hsl(var(--muted))]" />
          </div>

          <div className="space-y-2">
            <Label>Role</Label>
            <div>
              <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                {user.role}
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Member Since</Label>
            <Input
              value={new Date(user.createdAt).toLocaleDateString()}
              disabled
              className="bg-[hsl(var(--muted))]"
            />
          </div>

          {/* Editable fields */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4 border-t border-[hsl(var(--border))]">
            <div className="space-y-2">
              <Label htmlFor="name">Display Name</Label>
              <Input id="name" {...register("name")} />
              {errors.name && (
                <p className="text-sm text-[hsl(var(--destructive))]">
                  {errors.name.message}
                </p>
              )}
            </div>

            <Button type="submit" disabled={isLoading || !isDirty}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
