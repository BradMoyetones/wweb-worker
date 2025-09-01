import HomeIcon from "@/icons/Home"
import { Cog, MessageCircle, Youtube } from "lucide-react";
import { useLastVisitedPath } from "@/hooks/useLastVisitedPath";
import SideMenuItem from "@/components/SideMenuItem";
import { useVersion } from "@/contexts";
import { Card } from "@/components/ui/card";

export function AsideMenu() {
    const { navigateToLastPath } = useLastVisitedPath("/settings");
    const { appVersion } = useVersion()

    function openYoutube() {
        window.api.createNewWindow('https://www.youtube.com/')
    }

    return (
        <nav className="flex flex-col flex-1 gap-2">
            <Card className="rounded-lg p-2 bg-background">
                <ul className="relative">
                    <SideMenuItem to="/" id="homeButton">
                        <HomeIcon />
                        Home
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
                        Settings
                    </SideMenuItem>
                </ul>
            </Card>

            <Card className="rounded-lg p-2 flex-1 relative bg-background">
                <ul>
                    <SideMenuItem to="/">
                        <MessageCircle />
                        Your Chats
                    </SideMenuItem>

                  
                </ul>
            </Card>
        </nav>
    )
}
