"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// This function renders the login form and handles user login
export default function Login() {
  const [data, setData] = useState<{
    email: string;
    password: string;
  }>({
    email: "",
    password: "",
  });

  useEffect(() => {
    const fetchSession = async () => {
      const { data: session, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error.message);
        return;
      }
      if (session) {
        console.log("Session:", session);
      }
    };
    fetchSession();
  }, []);

  const router = useRouter();

  // This function handles the login process
  const login = async () => {
    try {
      console.log("Attempting to sign in with:", data.email);
      
      let { data: dataUser, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        console.error("Sign-in error:", error);
        return;
      }

      if (dataUser && dataUser.user) {
        console.log("Sign-in successful:", dataUser.user.email);
        console.log("User is anonymous:", dataUser.user.is_anonymous);
        
        // Redirect to visitor page to join a party
        router.push("/visitor");
        router.refresh();
      }
    } catch (error) {
      console.error("Sign-in error:", error);
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="w-full  lg:min-h-[600px]  xl:min-h-[800px] text-white">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold text-white">Login</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                type="text"
                name="email"
                value={data?.email}
                className="text-black"
                onChange={handleChange}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/visitor/sign-in/forgot-password"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input
                type="password"
                name="password"
                value={data?.password}
                onChange={handleChange}
                className="text-black"
                required
              />
            </div>
            <Button type="submit" onClick={login} className="w-full">
              Login
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="#" className="underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
