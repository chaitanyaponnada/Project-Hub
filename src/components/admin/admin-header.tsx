
"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Menu, Search } from "lucide-react";
import { AdminSidebar } from "./admin-sidebar";
import { Input } from "../ui/input";

export function AdminHeader() {
    return (
        <header className="flex h-16 items-center gap-4 border-b bg-background px-6 sticky top-0 z-30">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0">
                    <AdminSidebar isMobile={true} />
                </SheetContent>
            </Sheet>
            <div className="flex-1">
                <form>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search..."
                            className="w-full bg-muted pl-8 md:w-[200px] lg:w-[320px]"
                        />
                    </div>
                </form>
            </div>
        </header>
    );
}
