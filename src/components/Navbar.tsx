"use client";
import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";
import ThemeToggle from "./ThemeToggle"; // Make sure this exists

const Navbar = () => {
  const { data: session } = useSession();
  const user: User = session?.user;

  return (
    <nav className="p-4 md:p-6 shadow-md bg-gray-950 text-white sticky top-0 z-50">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Left: Logo */}
        <Link href="/" className="text-2xl font-bold">
          Mystery Message
        </Link>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Auth Buttons */}
          {session ? (
            <>
              <span className="hidden sm:inline">
                Welcome, {user.username || user.email}
              </span>
              <Button
                onClick={() => signOut()}
                className="bg-slate-100 text-black"
                variant="outline"
              >
                Logout
              </Button>
            </>
          ) : (
            <Link href="/sign-in">
              <Button
                className="bg-slate-100 text-black"
                variant="outline"
              >
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
