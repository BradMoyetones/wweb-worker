import { ChevronLeft, ChevronRight, Copy, Minus, Square, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../../../../components/ui/button";
import HomeIcon from "@/icons/Home"
import { useNavigate } from "react-router";
import ThemePresetSelect from "@/components/theme-preset-select";

export function TitleBar() {
    const [platform, setPlatform] = useState('');
    const [maximize, setMaximize] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate()

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            const value = await window.api.getPlatform();
            setPlatform(value);
            setLoading(false);
            window.api.isMaximized().then(setMaximize);
        };

        init();

        // 🔹 Escuchar evento en tiempo real
        window.api.onMaximizeChanged((isMax) => {
            setMaximize(isMax);
        });
    }, []);
    
    const handleMinimize = () => {
        window.api.minimize()
    }

    const handleMaximize = async() => {
        const handle = await window.api.maximize()
        setMaximize(handle)
    }

    const handleClose = () => {
        window.api.close()
    }
    
    return (
        <div
            id="titleBarApp"
            className="[grid-area:title] h-16 justify-between flex z-50 backdrop-blur-2xl"
        >
            <div
                className="no-drag flex items-center gap-2 pl-4"
            >
                <div className={`${!loading && platform === 'darwin' && "ml-14"} flex-shrink-0`}>
                    <button
                        className="w-11 px-3 py-2 h-full dark:hover:text-white dark:text-white/50 text-black/50 hover:text-black disabled:text-black/50 dark:disabled:hover:text-white/50 transition duration-300"
                        title="Back"
                        onClick={() => navigate(-1)}
                        disabled={window.history.state?.idx <= 1}
                    >
                        <ChevronLeft className="w-7 h-7" />
                    </button>

                    <button
                        className="w-11 px-3 py-2 h-full dark:hover:text-white dark:text-white/50 text-black/50 hover:text-black disabled:text-black/50 dark:disabled:hover:text-white/50 transition duration-300"
                        title="Forward"
                        onClick={() => navigate(1)}
                        disabled={window.history.state?.idx >= window.history.length - 1}
                    >
                        <ChevronRight className="w-7 h-7" />
                    </button>
                </div>

                <Button 
                    variant={"secondary"} 
                    size={"icon"} 
                    onClick={() => navigate("/", { viewTransition: true, replace: true })}
                    className="flex-shrink-0"
                >
                    <HomeIcon />
                </Button>
            </div>

            <div className="flex items-center gap-2 h-full">
                <div className="flex items-center no-drag gap-2">
                    {/* <Notificaciones /> */}
                    <ThemePresetSelect className="h-14 w-fit rounded-none z-50" disabled={false} />
                </div>


                {!loading && platform !== 'darwin' && (
                    <div className="flex items-center no-drag h-full">
                        <button
                            className="w-11 px-3 py-2 h-full hover:bg-black/5 dark:hover:bg-white/5 transition duration-300"
                            title="Minimize"
                            onClick={handleMinimize}
                        >
                            <Minus className="h-5 w-5" />
                        </button>
                        <button
                            className="w-11 px-3 py-2 h-full hover:bg-black/5 dark:hover:bg-white/5 transition duration-300"
                            title={maximize ? "Restore" : "Maximize"}
                            onClick={handleMaximize}
                        >
                            {maximize ? <Copy className="scale-x-[-1] h-5 w-5" /> : <Square className="h-5 w-5" />}
                        </button>
                        <button
                            className="w-11 px-3 py-2 h-full hover:bg-destructive hover:text-white transition duration-300"
                            title="Close"
                            onClick={handleClose}
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
