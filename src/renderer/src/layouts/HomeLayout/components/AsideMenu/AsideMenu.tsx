import HomeIcon from "@/icons/Home"
import { Archive, Cog, MessageCircle, MessageCircleOff, User2, Workflow, Youtube } from "lucide-react";
import { useLastVisitedPath } from "@/hooks/useLastVisitedPath";
import SideMenuItem from "@/components/SideMenuItem";
import { useVersion, useWhatsApp } from "@/contexts";
import { Card, CardContent } from "@/components/ui/card";
import Search from "@/icons/Search";
import { Button } from "@/components/ui/button";
import { useMemo, useRef, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";

export function AsideMenu() {
    const { navigateToLastPath } = useLastVisitedPath("/settings");
    const { appVersion } = useVersion()
    const { chats, user, chatSelected, setChatSelected } = useWhatsApp()
    const [showArchived, setShowArchived] = useState(false)
    const [searching, setSearching] = useState(false)
    const [searchText, setSearchText] = useState("")
    const inputRef = useRef<HTMLInputElement>(null)

    function openYoutube() {
        window.api.createNewWindow('https://www.youtube.com/')
    }

    const normalize = (str: string) =>
        str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    const filteredChats = useMemo(() => {
        const query = normalize(searchText);

        return chats
            .filter((chat) => {
                // quitamos el de estados
                if (chat.id._serialized === "status@broadcast") return false;

                // si está en modo "archivados" mostramos solo esos, si no, solo los normales
                if (showArchived ? !chat.archived : chat.archived) return false;

                // si no hay búsqueda, entra de una
                if (!searchText.trim()) return true;

                // campos a comparar
                const fields = [
                    chat.name,
                    chat.id._serialized,
                    chat.lastMessage?.body,
                ].filter(Boolean) as string[];

                return fields.some((field) => normalize(field).includes(query));
            })
            .sort((a, b) => (b.lastMessage?.timestamp || 0) - (a.lastMessage?.timestamp || 0));
    }, [searchText, chats, showArchived]);

    const archiveds = useMemo(() => chats.filter((value) => value.archived === true).length, [chats])
    
    return (
        <nav className="flex flex-col flex-1 gap-2">
            <Card className="rounded-lg p-2 bg-background">
                <ul className="relative">
                    <SideMenuItem to="/" id="homeButton">
                        <HomeIcon />
                        Inicio
                    </SideMenuItem>

                    <SideMenuItem to="/workflows" id="homeButton">
                        <Workflow />
                        Workflows
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
                    <div className="flex items-center justify-between pr-4">
                        <SideMenuItem to="/" className="sticky top-0 bg-background z-10">
                            <MessageCircle />
                            {!searching && "Tus Chats"}
                        </SideMenuItem>
                        <div className="relative">
                            <Input 
                                placeholder="Buscar..."
                                className="absolute right-[110%] z-10"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                ref={inputRef}
                                style={{
                                    opacity: searching ? "1" : 0,
                                    width: searching ? "195px" : 0,
                                    transition: ".5s"
                                }}
                            />
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant={"ghost"}
                                        size={"icon"}
                                        onClick={() => {
                                            setSearching(!searching)
                                            if(!searching) {
                                                inputRef.current?.focus()
                                            }
                                        }}
                                    >
                                        <Search />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Buscar</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    </div>
                    
                    {archiveds > 0 && (
                        <Button
                            className="w-full my-2"
                            variant={"outline"}
                            onClick={() => setShowArchived(!showArchived)}
                        >
                            {!showArchived ? <Archive /> : <MessageCircle />}
                            {!showArchived ? `Archivados ${archiveds}`: `Chats ${chats.length}`}
                        </Button>
                    )}

                    <div className="space-y-2">
                        {filteredChats.length > 0 ? filteredChats.map((chat) => {
                            return (
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
                            )
                        }): (
                            <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground py-10 text-center">
                                <MessageCircleOff />
                                <p>{searching ? `No hay coincidencias para ${searchText}` : "Aun no hay chats"}</p>
                            </div>
                        )}
                    </div>
                </ul>
            </Card>
        </nav>
    )
}
