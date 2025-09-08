import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { AsideMenu, TitleBar } from "./components";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function HomeLayout() {

    return (
        <div>

            <div id="app" className="relative h-screen space-x-2">
                <TitleBar />

                <aside className="[grid-area:aside] flex-col flex ml-2" id="sidebarMain">
                    <ScrollArea className=" h-full">
                        <AsideMenu />
                    </ScrollArea>
                </aside>

                <main
                    className="[grid-area:main] rounded-lg bg-background border overflow-auto h-full"
                    id="main"
                >
                    <Suspense fallback={<div>Loading...</div>}>
                        <Outlet />
                    </Suspense>
                </main>
            </div>
            
        </div>
    )
}
