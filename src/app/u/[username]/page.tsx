"use client";

import { useParams } from "next/navigation";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { messageSchema } from "@/schema/messageSchema";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApiResponse } from "@/types/ApiResponse";

const defaultSuggestions = [
  "What's your favorite movie?",
  "Do you have any pets?",
  "What's your dream job?",
];

const Page = () => {
  const { username } = useParams<{ username: string }>();
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const [suggestedMessages, setSuggestedMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const { toast } = useToast();

  const sendToTextArea = (message: string) => {
    form.setValue("content", message);
  };

  const suggestMessageMethod = async () => {
    setIsSuggesting(true);
    try {
      const res = await axios.post("/api/suggest-messages");
      const messages = res.data?.suggestedMessages as string;
      setSuggestedMessages(messages.split("||"));
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message ?? "Unable to fetch suggestions",
        variant: "destructive",
      });
    } finally {
      setIsSuggesting(false);
    }
  };

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setLoading(true);
    try {
      await axios.post("/api/send-messages", {
        content: data.content,
        username,
      });
      toast({
        title: "Success",
        description: "Your message has been sent to the creator.",
      });
      form.reset({ content: "" });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message ?? "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto my-8 p-6 rounded max-w-4xl shadow-md bg-white dark:bg-gray-900">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800 dark:text-white">
        Send Anonymous Message to @{username}
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 dark:text-gray-200">
                  Message
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your message here..."
                    {...field}
                    className="resize-none bg-gray-50 dark:bg-gray-800 dark:text-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading && (
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
              )}
              Send
            </Button>
          </div>
        </form>
      </Form>

      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            Suggested Messages
          </h2>
          <Button onClick={suggestMessageMethod} disabled={isSuggesting}>
            {isSuggesting && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
            Suggest
          </Button>
        </div>

        <Card className="w-full bg-gray-50 dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-800 dark:text-white">
              Click on any message to use it
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col space-y-2">
            {(suggestedMessages.length > 0 ? suggestedMessages : defaultSuggestions).map(
              (message, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-fit dark:border-gray-600 dark:text-gray-100"
                  onClick={() => sendToTextArea(message)}
                >
                  {message}
                </Button>
              )
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Page;
