import Greeting from "@/components/Greeting";
import { useWhatsApp } from "@/contexts";
import { Chat } from "./components";
import { MessageCircleMore } from "lucide-react";
import { useEffect } from "react";

export default function Home() {
    const {chatSelected, setChatSelected} = useWhatsApp()

    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") {
                setChatSelected("");
            }
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [setChatSelected]);
    
    return (
        <div
            id="playlist-container"
            className="relative transition-all duration-1000 rounded-lg"
        >
            <div className="relative z-10">
                <div className="px-6 pt-10 pb-6">
                    <Greeting />
                </div>

                {chatSelected.trim() ? (
                    <Chat />
                ) : (
                    <div className="flex items-center justify-center flex-col px-10 py-20 text-primary-foreground/60 gap-4">
                        <MessageCircleMore size={40} />
                        <h1>Selecciona un chat para comenzar</h1>
                    </div>
                )}
                
                <div
                    className="absolute top-0 left-0 right-0 h-[80vh] bg-gradient-to-b from-primary via-primary/50  -z-[1]"
                >
                </div>
            </div>
        </div>
    )
}
