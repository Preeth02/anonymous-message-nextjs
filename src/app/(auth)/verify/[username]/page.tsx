"use client";
import React from "react";
import { useToast } from "@/hooks/use-toast";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { verifySchema } from "@/schema/verifySchema";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const res = await axios.post("/api/verifyCode", {
        username: params.username,
        verifyCode: data.code,
      });
      toast({
        title: "Verification Success",
        description: res.data.message,
      });
      router.replace("/sign-in");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        description:
          axiosError.response?.data.message ??
          "An error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200 dark:bg-gray-900 transition-colors">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg transition-colors">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4 text-gray-900 dark:text-white">
            Verify Your Account
          </h1>
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            Enter the 6-digit code sent to your email
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex text-gray-700 dark:text-gray-300">
                      Verification Code
                    </FormLabel>
                    <FormControl>
                      <InputOTP
                        maxLength={6}
                        {...field}
                        inputMode="numeric"
                        pattern="[0-9]*"
                      >
                        <InputOTPGroup>
                          {[0, 1, 2, 3, 4, 5].map((index) => (
                            <InputOTPSlot
                              key={index}
                              index={index}
                              className="border-black dark:border-white"
                            />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormDescription className="text-gray-500 dark:text-gray-400">
                      Enter your 6-digit code
                    </FormDescription>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 rounded"
              >
                Submit
              </Button>
            </form>
          </Form>

          <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
            Already verified?{" "}
            <Link
              href="/sign-in"
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
