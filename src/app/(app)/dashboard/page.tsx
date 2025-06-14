"use client";

import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/model/User";
import { acceptMessageSchema } from "@/schema/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

function Page() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState<boolean>(false);

  const messDelete = (messageId: string): void => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const { toast } = useToast();
  const { register, watch, setValue } = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });
  const { data: session } = useSession();

  const acceptingMessage = watch("acceptMessages");

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsSwitchLoading(false);
      setLoading(true);
      try {
        const res = await axios.get<ApiResponse>("/api/get-messages");
        setMessages(res.data.messages || []);
        if (refresh) {
          toast({
            title: "Refreshed message",
            description: "Showing latest messages",
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: "Error",
          description:
            axiosError.response?.data.message ??
            "Something went wrong while fetching the messages",
        });
      } finally {
        setIsSwitchLoading(false);
        setLoading(false);
      }
    },
    [toast]
  );

  const fetchAcceptingMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const res = await axios.get<ApiResponse>("/api/accept-messages");
      setValue("acceptMessages", res.data?.isAcceptingMessages as boolean);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ??
          "Something went wrong while fetching the messages",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [toast, setValue]);

  const handleAcceptMessage = async (newVal: boolean) => {
    setIsSwitchLoading(true);
    try {
      const res = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptingMessages: newVal,
      });
      setValue("acceptMessages", newVal);
      toast({
        title: res.data.message,
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ??
          "Something went wrong while updating the setting",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  };

  useEffect(() => {
    if (!session || !session.user) return;
    fetchAcceptingMessage();
    fetchMessages();
  }, [
    session?.user?._id,
    setValue,
    toast,
    fetchAcceptingMessage,
    fetchMessages,
  ]);

  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  if (!session || !session.user) return <></>;
  const profileUrl = `${baseUrl}/u/${session.user.username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "URL copied",
      description: "Profile URL has been copied to clipboard.",
    });
  };

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto w-full max-w-6xl">
      {/* Top Navbar with Toggle */}
      <div className="flex items-center justify-between bg-muted p-4 rounded-lg shadow mb-6">
        <h1 className="text-2xl font-bold">User Dashboard</h1>
        <div className="flex items-center gap-2">
          <Switch
            checked={acceptingMessage}
            onCheckedChange={handleAcceptMessage}
            disabled={isSwitchLoading}
          />
          <span className="text-sm">
            {acceptingMessage ? "Accepting Messages" : "Not Accepting"}
          </span>
        </div>
      </div>

      {/* Copy Profile URL */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Your Unique Profile URL</h2>
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2 rounded border"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      {/* Refresh and Messages */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Messages</h2>
        <Button
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            fetchMessages(true);
          }}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCcw className="h-4 w-4" />
          )}
        </Button>
      </div>

      <Separator className="mb-4" />

      {/* Message Cards */}
      {messages.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {messages.map((mess: Message) => (
            <MessageCard
              key={mess._id as string}
              message={mess}
              onMessageDelete={messDelete}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No messages to display</p>
      )}
    </div>
  );
}

export default Page;
