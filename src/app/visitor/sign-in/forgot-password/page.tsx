"use client";
import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Terminal } from "lucide-react";

const PasswordResetPage = () => {
  const [data, setData] = useState({ email: "" });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePasswordReset = async () => {
    try {
      // Replace with your password reset logic
      await supabase.auth.resetPasswordForEmail(data.email);
      setSuccess(true);
      setError(false);
    } catch (err) {
      setSuccess(false);
      setError(true);
    }
  };

  return (
    <div className="w-full lg:min-h-[600px] xl:min-h-[800px] text-white">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold text-white">
              Reset Your Password
            </h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to reset your password
            </p>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                type="text"
                name="email"
                value={data.email}
                className="text-black"
                onChange={handleChange}
              />
            </div>
            <Button onClick={handlePasswordReset} className="btn btn-primary">
              Reset Password
            </Button>
            {success && (
              <Alert>
                <Terminal className="h-4 w-4" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>
                  We sent you an email with a link to reset your password.
                </AlertDescription>
              </Alert>
            )}
            {error && (
              <Alert>
                <Terminal className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  There was an error resetting your password. Please try again.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetPage;
