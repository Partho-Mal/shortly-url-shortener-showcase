// app/signup/page.tsx

/**
 * Renders user registration page.
 * Allows Google OAuth signup or manual registration via username, email, and password.
 */

"use client";

import { useState } from "react";
import { Eye, EyeOff, GalleryVerticalEnd } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const togglePassword = (): void => {
    setShowPassword((prev) => !prev);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      if (data.token) {
        localStorage.setItem("jwt", data.token);
        window.location.href = "/login";
        return;
      }

      window.location.href = "/login";
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 self-center font-medium"
        >
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          URL Shortener
        </Link>

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl text-center">
              Create an account
            </CardTitle>

            <div className="text-center text-muted-foreground text-sm">
              Sign up with your Google account
            </div>
          </CardHeader>

          <CardContent className="grid gap-6">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_GOOGLE_OAUTH_LOGIN_PATH}`;
              }}
            >
              {/* Google SVG logo */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <defs>
                  <radialGradient
                    id="prefix__b"
                    cx="1.479"
                    cy="12.788"
                    fx="1.479"
                    fy="12.788"
                    r="9.655"
                    gradientTransform="matrix(.8032 0 0 1.0842 2.459 -.293)"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset=".368" stopColor="#ffcf09" />
                    <stop offset=".718" stopColor="#ffcf09" stopOpacity=".7" />
                    <stop offset="1" stopColor="#ffcf09" stopOpacity="0" />
                  </radialGradient>

                  <radialGradient
                    id="prefix__c"
                    cx="14.295"
                    cy="23.291"
                    fx="14.295"
                    fy="23.291"
                    r="11.878"
                    gradientTransform="matrix(1.3272 0 0 1.0073 -3.434 -.672)"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset=".383" stopColor="#34a853" />
                    <stop offset=".706" stopColor="#34a853" stopOpacity=".7" />
                    <stop offset="1" stopColor="#34a853" stopOpacity="0" />
                  </radialGradient>

                  <linearGradient
                    id="prefix__d"
                    x1="23.558"
                    y1="6.286"
                    x2="12.148"
                    y2="20.299"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset=".671" stopColor="#4285f4" />
                    <stop offset=".885" stopColor="#4285f4" stopOpacity="0" />
                  </linearGradient>

                  <clipPath id="prefix__a">
                    <path
                      d="M22.36 10H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53h-.013l.013-.01c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09c.87-2.6 3.3-4.53 6.16-4.53 1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07 1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93v.01C3.99 20.53 7.7 23 12 23c2.97 0 5.46-.98 7.28-2.66 2.08-1.92 3.28-4.74 3.28-8.09 0-.78-.07-1.53-.2-2.25z"
                      fill="none"
                    />
                  </clipPath>
                </defs>

                <path
                  d="M22.36 10H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53h-.013l.013-.01c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09c.87-2.6 3.3-4.53 6.16-4.53 1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07 1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93v.01C3.99 20.53 7.7 23 12 23c2.97 0 5.46-.98 7.28-2.66 2.08-1.92 3.28-4.74 3.28-8.09 0-.78-.07-1.53-.2-2.25z"
                  fill="#fc4c53"
                />

                <g clipPath="url(#prefix__a)">
                  <ellipse
                    cx="3.646"
                    cy="13.572"
                    rx="7.755"
                    ry="10.469"
                    fill="url(#prefix__b)"
                  />

                  <ellipse
                    cx="15.538"
                    cy="22.789"
                    rx="15.765"
                    ry="11.965"
                    transform="rotate(-7.12 15.539 22.789)"
                    fill="url(#prefix__c)"
                  />

                  <path
                    fill="url(#prefix__d)"
                    d="M11.105 8.28l.491 5.596.623 3.747 7.362 6.848 8.607-15.897-17.083-.294z"
                  />
                </g>
              </svg>
              Sign up with Google
            </Button>

            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
              <span className="bg-card text-muted-foreground relative z-10 px-2">
                Or continue with
              </span>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  placeholder="John Doe"
                  value={form.username}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid gap-3 relative">
                <Label htmlFor="password">Password</Label>

                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="pr-10"
                />

                <button
                  type="button"
                  onClick={togglePassword}
                  className="absolute right-3 top-1/2 mt-1 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              <Button type="submit" className="w-full">
                Sign Up
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary underline underline-offset-4"
              >
                Login
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
