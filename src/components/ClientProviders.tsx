"use client";
import { ThemeProvider } from "next-themes";
import { useState, useEffect, FC } from "react";
import { Toaster } from "@/components/ui/Toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface ClientProvidersProps {
  children: React.ReactNode;
}

const ClientProviders: FC<ClientProvidersProps> = ({ children }) => {
  const queryClient = new QueryClient();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <QueryClientProvider client={queryClient}>
        <Toaster />
        {children}
      </QueryClientProvider>
    );
  }

  return (
    <ThemeProvider attribute="class">
      <QueryClientProvider client={queryClient}>
        <Toaster />
        {children}
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default ClientProviders;
