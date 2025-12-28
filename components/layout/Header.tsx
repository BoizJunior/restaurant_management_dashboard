import { MainNav } from "@/components/layout/MainNav";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { CompareSheet } from "@/components/shared/CompareSheet";

export function Header() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <a className="mr-6 flex items-center space-x-2 font-bold" href="/">
            Generic Restaurant
          </a>
          <MainNav />
        </div>
        <div className="md:hidden flex items-center w-full justify-between">
           <span className="font-bold">Generic Restaurant</span>
           {/* Mobile Menu could go here */}
        </div>
        <div className="ml-auto flex items-center space-x-2">
          <CompareSheet />
        </div>
      </div>
    </header>
  );
}
