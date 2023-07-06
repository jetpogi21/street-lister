"use client";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/skeleton";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

//Generated by GeneratePageFile
import React from "react";

const SessionButton: React.FC = () => {
  const { status, data } = useSession();
  console.log(status);

  // Use a switch statement instead of multiple if statements
  switch (status) {
    case "loading":
      return <Skeleton className="w-[70px] rounded-full h-9" />;
    case "unauthenticated":
      return (
        <Button
          asChild
          className="rounded-full"
        >
          <Link href="/dashboard/login">Login</Link>
        </Button>
      );
    default:
      // Use a function to handle the sign out logic
      const handleSignOut = () => {
        signOut({
          callbackUrl: `${window.location.origin}/dashboard/login`,
        });
      };
      return (
        <Button
          variant="outline"
          onClick={handleSignOut}
          className="rounded-full bg-secondary"
        >
          Logout
        </Button>
      );
  }
};

export default SessionButton;
