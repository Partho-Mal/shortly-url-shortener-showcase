// components/login-form.tsx

/**
 * Login form supporting email/password and Google OAuth.
 * Submits to backend authentication endpoint with credential cookies.
 */

"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = (): void => setShowPassword((prev) => !prev);

  const googleUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_GOOGLE_OAUTH_LOGIN_PATH}`;
  const loginUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_LOGIN_PATH}`;

  const handleLogin = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    try {
      const res = await fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.token) {
          localStorage.setItem("jwt", data.token);
        }
        window.location.href = "/dashboard";
      } else {
        alert(data.error || "Login failed");
      }
    } catch {
      // Error logged for debugging
    }
  };

  return (
    <div
      className={cn("flex flex-col gap-6 min-h-screen", className)}
      {...props}
    >
      <div className="w-full max-w-md">
        <Card className="shadow-lg md:rounded-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Welcome back</CardTitle>
            <CardDescription>Login with your Google account</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="grid gap-6">
                <div className="flex flex-col gap-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    type="button"
                    onClick={(): void => {
                      window.location.href = googleUrl;
                    }}
                  >
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
                          <stop
                            offset=".718"
                            stopColor="#ffcf09"
                            stopOpacity=".7"
                          />
                          <stop
                            offset="1"
                            stopColor="#ffcf09"
                            stopOpacity="0"
                          />
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
                          <stop
                            offset=".706"
                            stopColor="#34a853"
                            stopOpacity=".7"
                          />
                          <stop
                            offset="1"
                            stopColor="#34a853"
                            stopOpacity="0"
                          />
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
                          <stop
                            offset=".885"
                            stopColor="#4285f4"
                            stopOpacity="0"
                          />
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
                    Login with Google
                  </Button>
                </div>

                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                  <span className="bg-card text-muted-foreground relative z-10 px-2">
                    Or continue with
                  </span>
                </div>

                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      value={email}
                      onChange={(e): void => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid gap-3">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                      <a
                        href="/resetpassword"
                        className="ml-auto text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </a>
                    </div>

                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        className="pr-10"
                        value={password}
                        onChange={(e): void => setPassword(e.target.value)}
                        required
                      />

                      <button
                        type="button"
                        onClick={togglePassword}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full">
                    Login
                  </Button>
                </div>

                <div className="text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <a href="/signup" className="underline underline-offset-4">
                    Sign up
                  </a>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
