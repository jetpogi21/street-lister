"use client";
//Generated by GeneratePageFile
import Link from "next/link";
import React, { useEffect, useState } from "react";
import DarkLightToggle from "./DarkLightToggle";
import { cn } from "@/lib/utils";

type Link = {
  id: number;
  name: string;
  href: string;
};

const links: Link[] = [];

type Timer = ReturnType<typeof setTimeout>;

function debounce<T extends (...args: any[]) => void>(
  fn: T,
  ms: number
): (...args: Parameters<T>) => void {
  let timer: Timer | null;

  return function (this: any, ...args: Parameters<T>): void {
    clearTimeout(timer as Timer);
    timer = setTimeout(() => {
      timer = null;
      fn.apply(this, args);
    }, ms);
  };
}

const Header: React.FC = () => {
  const [pressed, setPressed] = useState(false);

  const togglePress = () => {
    setPressed(!pressed);
  };

  const resetPress = () => {
    setPressed(false);
  };

  useEffect(() => {
    const debouncedHandleResize = debounce(function handleResize() {
      if (window.innerWidth > 768) {
        setPressed(false);
      }
    }, 1000);

    window.addEventListener("resize", debouncedHandleResize);

    if (pressed) {
      document.body.classList.add("fixed");
    } else {
      document.body.classList.remove("fixed");
    }

    return () => {
      window.removeEventListener("resize", debouncedHandleResize);
    };
  }, [pressed]);

  return (
    <div className="h-[100px] max-w-screen-lg w-full flex justify-between px-4 mx-auto z-40">
      <Link
        className="my-auto text-lg font-bold leading-none"
        href="/"
      >
        Street Lister
      </Link>
      <div className="flex items-center gap-2 text-sm">
        <DarkLightToggle />
        <div className="flex items-center gap-2 md:gap-0 md:flex-row-reverse">
          {/* <Toggle
            pressed={pressed}
            onPressedChange={togglePress}
            className="md:hidden"
          >
            <Icons.menu className="w-5 h-5" />
          </Toggle> */}
          <div
            className={cn(
              "fixed top-[100px] left-0 gap-2 w-full h-0 overflow-clip transition-all bg-background px-3 text-center",
              "md:static md:h-auto",
              {
                "h-[calc(100vh-100px)]": pressed,
              }
            )}
          >
            <div className={cn("flex flex-col gap-2", "md:flex-row")}>
              {links.map((link) => (
                <Link
                  key={link.id}
                  href={link.href}
                  className="p-2 rounded-full hover:bg-accent w-auto min-w-[75px]"
                  onClick={resetPress}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
