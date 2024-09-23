"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const [data, setData] = useState<{
    email: string;
    password: string;
  }>({
    email: "",
    password: "",
  });

  const router = useRouter();

  const login = async () => {
    try {
      let { data: dataUser, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (dataUser) {
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      console.log(error);
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
    <div className="container mx-auto  w-[400px] grid gap-4 place-items-center">
      <div className="grid space-y-4 w-full">
        <Label>E-Mail</Label>
        <Input
          type="text"
          name="email"
          value={data?.email}
          onChange={handleChange}
          className="text-black"
        />
      </div>
      <div className="grid w-full">
        <Label>Password</Label>
        <Input
          type="password"
          name="password"
          value={data?.password}
          onChange={handleChange}
          className="text-black"
        />
      </div>
      <div>
        <button
          className="px-4 py-2 bg-blue-500 rounded cursor-pointer"
          onClick={login}
        >
          Login
        </button>
      </div>
    </div>
  );
}
