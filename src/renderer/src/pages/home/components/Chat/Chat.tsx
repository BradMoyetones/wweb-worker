import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useTheme, useWhatsApp } from "@/contexts"
import { Reply, RotateCcw, Send, Smile, User2, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Chat as ChatType, Message, MessageMedia, MessageTypes } from "whatsapp-web.js"
import Picker from '@emoji-mart/react'
import data from '@emoji-mart/data'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent } from "@/components/ui/card"

type MessageType = Message & { isFalse?: boolean; tempId?: string; failed?: boolean };

export function Chat() {
    const [messages, setMessages] = useState<MessageType[]>([])
    const { chatSelected, chats, user } = useWhatsApp()
    const [chatInfo, setChatInfo] = useState<ChatType | null>(null)
    const editableRef = useRef<HTMLDivElement>(null)
    const [messageContent, setMessageContent] = useState("")
    const [reply, setReply] = useState<Message | null>(null)
    const { theme } = useTheme()
    const messagesEndRef = useRef<HTMLDivElement>(null)
    // refs para evitar re-registros y tener valores actuales
    const listenerRegisteredRef = useRef<boolean>(false);
    const chatSelectedRef = useRef<string>(chatSelected);
    useEffect(() => { chatSelectedRef.current = chatSelected; }, [chatSelected]);

    const fetchMessages = async() => {
        const data = await window.whatsappApi.getMessagesChat(chatSelected);
        setMessages(data)
    }

    useEffect(() => {
        if(!chatSelected.trim()) return
        setMessages([])
        fetchMessages()
    }, [chatSelected])

    useEffect(() => {
        if(!chatSelected.trim()) return
        setChatInfo(chats.find((value) => value.id._serialized === chatSelected) || null)
    }, [chatSelected, chats])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    // const handleSendMessage = async (e: React.FormEvent) => {
    //     e.preventDefault();

    //     if (!messageContent.trim() || !chatInfo) return;

    //     try {
    //         await window.whatsappApi.sendMessage(
    //             chatInfo.id._serialized,         // id del chat actual
    //             messageContent.trim(),            // el contenido del mensaje
    //             reply ? reply.id._serialized : null // si existe reply pasamos el id, si no null
    //         );

    //         // limpiar input y reply
    //         setMessageContent("");
    //         if (editableRef.current) {
    //             editableRef.current.innerText = "";
    //         }
    //         setReply(null);

    //     } catch (err) {
    //         console.error("Error enviando mensaje:", err);
    //     }
    // };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!messageContent.trim() || !chatInfo) return;

        const content = messageContent.trim();
        const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
        const now = Math.floor(Date.now() / 1000);

        // Construimos un mensaje temporal (suficiente para render)
        const tempMsg = {
            id: { _serialized: tempId },
            from: user?.wid?._serialized ?? "me",
            to: chatInfo.id._serialized,
            fromMe: true,
            body: content,
            timestamp: now,
            hasMedia: false,
            type: "chat",
            isFalse: true,
            tempId,
        } as unknown as MessageType;

        // Push optimista
        setMessages((prev) => [...prev, tempMsg]);
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

        setMessageContent("");
        if (editableRef.current) editableRef.current.innerText = "";
        setReply(null);

        try {
            const result = await window.whatsappApi.sendMessage(
                chatInfo.id._serialized,
                content,
                reply ? reply.id._serialized : null
            );

            console.log(result);
            
        } catch (err) {
            console.error("Error enviando mensaje:", err);
            // marcar temp como failed
            setMessages((prev) => prev.map(m => m.tempId === tempId ? { ...m, failed: true } : m));
        }
    };

    const handleInput = () => {
        const text = editableRef.current?.innerText || ""
        setMessageContent(text)
    }

    useEffect(() => {
        if (listenerRegisteredRef.current) return;
        listenerRegisteredRef.current = true;

        window.whatsappApi.onMessage((msg: Message) => {
            const currentChat = chatSelectedRef.current;
            if (!currentChat) return;

            // si no pertenece al chat actual -> ignorar
            if (!(msg.from === currentChat || msg.to === currentChat)) return;

            setMessages((prev) => {
                // si ya tenemos exactamente ese mensaje (por id), no duplicar
                if (prev.some(m => m.id && m.id._serialized === msg.id._serialized)) {
                    return prev;
                }

                // intentar casar con un temp (heurística)
                const tempIndex = prev.findIndex(m =>
                    m.isFalse &&
                    m.fromMe && // temp fue creado como fromMe
                    typeof m.body === "string" &&
                    m.body === msg.body &&
                    Math.abs((m.timestamp || 0) - (msg.timestamp || 0)) < 30 // 30s ventana
                );

                if (tempIndex !== -1) {
                    const newArr = [...prev];
                    newArr[tempIndex] = msg as MessageType; // reemplazamos temp con el real
                    return newArr;
                }

                // si no había temp, append normal
                return [...prev, msg as MessageType];
            });

            // aseguramos scroll
            setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
        });
    }, []); // solo una vez

    return (
        <div className="flex flex-col h-full min-h-[calc(100vh-100px-66px)]">
            <div
                className="sticky top-0 w-full py-2 px-4 bg-background z-10 flex border-b"
            >
                <div className="flex items-center gap-2">
                    <div
                        className={`size-12 rounded-full object-cover object-center flex items-center justify-center bg-primary`}
                    >
                        <User2 />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold">{chatInfo?.name}</h1>
                        <p className="text-sm opacity-70">+{chatInfo?.id.user}</p>
                    </div>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-primary-foreground">
                        <p>No se encontraron mensajes</p>
                    </div>
                ) : (
                    messages.map((message, index) => (
                        <div key={index} className={`flex ${message.fromMe ? "justify-end" : "justify-start"}`}>
                            <div
                                className={`max-w-[70%] rounded-lg px-3 py-2 relative group 
                                    ${message.fromMe ? "bg-primary text-primary-foreground" : "bg-muted"}
                                    ${message.isFalse ? "opacity-50 pointer-events-none" : ""} 
                                    ${message.failed ? "ring-1 ring-red-400" : ""}
                                `}
                            >
                                <Button
                                    className={`absolute text-accent-foreground opacity-0 group-hover:opacity-100 transition-all ${message.fromMe ? "-left-[40px]" : "-right-[40px]"} top-[35%] rounded-full`}
                                    variant={"ghost"}
                                    size={"icon"}
                                    onClick={() => {
                                        setReply(message)
                                    }}
                                >
                                    <Reply />
                                </Button>
                                {message.hasMedia ? (
                                    <MediaRenderer message={message} chatId={chatSelected} />
                                ) : (
                                    <p className="text-sm whitespace-pre-wrap break-words">{message.body}</p>
                                )}
                                <span className="text-xs opacity-70 mt-1 block w-fit ml-auto">
                                    {new Date(message.timestamp * 1000).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </span>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>
            
            <form
                onSubmit={handleSendMessage}
                className="flex flex-col gap-2 mt-4 border-t border-border bg-background/10 backdrop-blur-2xl p-4 sticky bottom-0 transition-all"
            >
                {reply && (
                    <div className="flex items-center gap-2">
                        <Card className="w-full border-l-4 !border-l-primary py-2">
                            <CardContent className="px-4">
                                <div className="">
                                    <h1 className="font-bold text-sm">
                                        {reply.fromMe ? "Tú" : chatInfo?.name}
                                        
                                    </h1>
                                    {reply.hasMedia && (
                                        <p className="text-sm opacity-70 italic">Archivo</p>
                                    )}
                                    <p className="text-sm opacity-70">{reply.body}</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Button
                            variant={"outline"}
                            size={"icon"}
                            className="rounded-full size-6"
                            onClick={() => setReply(null)}
                        >
                            <X />
                        </Button>
                    </div>
                )}
                <div className="flex items-center gap-2">
                    <div className="relative w-full">
                        <div
                            ref={editableRef}
                            contentEditable
                            role="textbox"
                            aria-multiline="true"
                            suppressContentEditableWarning
                            className="w-full min-h-[36px] max-h-36 overflow-y-auto outline-none rounded-3xl px-4 py-2 pr-10 bg-muted text-sm whitespace-pre-wrap break-words"
                            style={{ wordBreak: "break-word" }}
                            onInput={handleInput}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey && !e.altKey) {
                                    e.preventDefault()
                                    if (messageContent.trim()) {
                                        handleSendMessage(e)
                                    }
                                }
                            }}
                        >
                        </div>
                        <span className="absolute left-4 text-muted-foreground top-2 text-sm pointer-events-none">{!messageContent.trim() && "Escribe un mensaje..."}</span>
                        <div className="relative">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        type="button"
                                        variant={"ghost"}
                                        size={"icon"}
                                        className="absolute right-1 bottom-[1.5px] z-10 rounded-full"
                                    >
                                        <Smile />
                                        <span className="sr-only">Emogis</span>
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-full bg-background/10 backdrop-blur-2xl p-2">
                                    <Picker
                                        data={data}
                                        theme={theme}
                                        locale="es"
                                        previewPosition={"none"}
                                        navPosition={"bottom"}
                                        // onClickOutside={}
                                        onEmojiSelect={(emoji: { native: string }) => {
                                            setMessageContent((prev) => prev + emoji.native);
                                            if (editableRef.current) {
                                                editableRef.current.innerText += emoji.native;
                                            }
                                        }}

                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                type="submit"
                                disabled={!messageContent.trim()}
                            >
                                <Send />
                                <span className="sr-only">Send Message</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                            <p>Send</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </form>
        </div>
    )
}


function MediaRenderer({ message, chatId }: { message: Message; chatId: string }) {
    const [media, setMedia] = useState<any>(null);

    if (!message.hasMedia) {
        return <p>[Sin media]</p>;
    }

    if (!media) {
        return (
            <button
                className="text-xs underline bg-primary-foreground text-primary flex items-center justify-center rounded-sm w-24 h-24"
                onClick={async () => {
                    const m = await reloadMedia(message.id._serialized, chatId);
                    if (!m?.error) setMedia(m);
                }}
            >
                <RotateCcw />
            </button>
        );
    }

    const src = `data:${media.mimetype};base64,${media.data}`;
    const typeMessage = message.type as MessageTypes;

    switch (typeMessage) {
        case "sticker":
            return <img src={src} className="w-28 h-28" />;

        case "image":
            return <img src={src} className="rounded-lg max-w-md w-full" />;

        case "video":
            return <video controls className="rounded-lg max-w-md w-full" src={src} />;

        case "audio":
        case "ptt": // voice
            return (
                <div className="max-w-xs">
                    <audio controls src={src} className="w-full" />
                </div>
            );

        case "document":
            return (
                <a
                    href={src}
                    download={media.filename || "file"}
                    className="underline text-sm"
                >
                    Descargar archivo
                </a>
            );

        default:
        return (
            <a
                href={src}
                download={media.filename || "file"}
                className="underline text-sm"
            >
                Descargar archivo
            </a>
        );
    }
}

async function reloadMedia(messageId: string, chatId: string) {
    const media = await window.whatsappApi.downloadMedia(messageId, chatId) as MessageMedia & {error?: string};
    return media;
}
