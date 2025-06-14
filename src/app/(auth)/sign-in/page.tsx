"use client";
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import * as z from "zod";
import { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { signInSchema } from "@/schema/signInSchema";
import { signIn } from "next-auth/react";
import Link from "next/link";

const SignIn = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        identifier: data.identifier,
        password: data.password,
      });
      if (result?.error) {
        if (result.error == "CredentialsSignin")
          toast({
            title: "Signin failed",
            description: "Incorrect username or password",
            variant: "destructive",
          });
        else {
          toast({
            title: "Signin failed",
            description: result.error,
            variant: "destructive",
          });
        }
      }
      if (result?.url) {
        router.replace(`/dashboard`);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast({
        title: "Signin failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-200 dark:bg-gray-950">
      <div className="w-full max-w-md space-y-6 bg-gray-100 dark:bg-gray-900 p-8 rounded-2xl shadow-md border border-gray-200 dark:border-gray-800">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome Back
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            Sign in to your account to manage messages
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  {" "}
                  <FormLabel className="flex">Email or Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Email or Username" {...field} />
                  </FormControl>
                  <FormMessage className="flex" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex">Password</FormLabel>
                  <FormControl>
                    <Input placeholder="password" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className={`bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded ${isSubmitting && " opacity-50 cursor-not-allowed"} `}
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" />
              ) : (
                <span>Submit</span>
              )}
            </Button>
          </form>
        </Form>

        <p className="text-sm text-center text-gray-600 dark:text-gray-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
