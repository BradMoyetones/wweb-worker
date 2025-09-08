import HomeIcon from "@/icons/Home"
import { Cog, MessageCircle, MessageCircleOff, User2, Youtube } from "lucide-react";
import { useLastVisitedPath } from "@/hooks/useLastVisitedPath";
import SideMenuItem from "@/components/SideMenuItem";
import { useVersion, useWhatsApp } from "@/contexts";
import { Card, CardContent } from "@/components/ui/card";

export function AsideMenu() {
    const { navigateToLastPath } = useLastVisitedPath("/settings");
    const { appVersion } = useVersion()
    const { chats, user, chatSelected, setChatSelected } = useWhatsApp()

    function openYoutube() {
        window.api.createNewWindow('https://www.youtube.com/')
    }

    return (
        <nav className="flex flex-col flex-1 gap-2">
            <Card className="rounded-lg p-2 bg-background">
                <ul className="relative">
                    <SideMenuItem to="/" id="homeButton">
                        <HomeIcon />
                        Inicio
                    </SideMenuItem>

                    <SideMenuItem onClick={() => openYoutube()} id="youtubeButton">
                        <Youtube />
                        YouTube
                    </SideMenuItem>

                    <SideMenuItem onClick={navigateToLastPath} id="settingsButton">
                        <div className="relative">
                            {(appVersion?.newVersion) && (
                                <span className="absolute w-3 h-3 bg-yellow-400 rounded-full -top-1 -right-1 animate-pulse"></span>
                            )}
                            <Cog />
                        </div>
                        Configuraciones
                    </SideMenuItem>
                </ul>
            </Card>

            <Card className="rounded-lg p-2 flex-1 relative bg-background">
                <ul>
                    <SideMenuItem to="/" className="sticky top-0 bg-background z-10">
                        <MessageCircle />
                        Tus Chats
                    </SideMenuItem>

                    <div className="space-y-2">
                        {chats.length > 0 ? chats.map((chat) => (
                            <Card 
                                key={chat.id._serialized+"-aside"}
                                className={`p-0 rounded-sm cursor-pointer ${chatSelected === chat.id._serialized && "bg-primary"}`}
                                onClick={() => setChatSelected(chat.id._serialized)}
                            >
                                <CardContent className="p-3">
                                    <div className="flex gap-2 items-center">
                                        <div
                                            className={`size-12 rounded-full object-cover object-center flex items-center justify-center ${chatSelected === chat.id._serialized ? "bg-primary-foreground text-primary" : "bg-primary text-primary-foreground"}`}
                                        >
                                            <User2 />
                                        </div>
                                        <article className={`${chatSelected === chat.id._serialized && "text-primary-foreground"}`}>
                                            <h1 className={`font-bold line-clamp-1`}>{chat.name}</h1>
                                            <p className={`line-clamp-1 max-w-[210px] opacity-80 text-sm`}>{chat.lastMessage?.author === user?.wid._serialized && "Yo: "}{chat.lastMessage?.body || 'Sin mensajes'}</p>

                                        </article>
                                    </div>
                                </CardContent>
                            </Card>
                        )): (
                            <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground py-10">
                                <MessageCircleOff />
                                <p>Aun no hay chats</p>
                            </div>
                        )}
                    </div>
                </ul>
            </Card>
        </nav>
    )
}
