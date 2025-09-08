import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useTheme, useWhatsApp } from "@/contexts"
import { RotateCcw, Send, Smile, User2 } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Chat as ChatType, Message, MessageMedia, MessageTypes } from "whatsapp-web.js"
import Picker from '@emoji-mart/react'
import data from '@emoji-mart/data'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export function Chat() {
    const [messages, setMessages] = useState<Message[]>([])
    const { chatSelected, chats } = useWhatsApp()
    const [chatInfo, setChatInfo] = useState<ChatType | null>(null)
    const editableRef = useRef<HTMLDivElement>(null)
    const [messageContent, setMessageContent] = useState("")
    const { theme } = useTheme()
    const messagesEndRef = useRef<HTMLDivElement>(null)

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

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()

    }

    const handleInput = () => {
        const text = editableRef.current?.innerText || ""
        setMessageContent(text)
    }

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
                                className={`max-w-[70%] rounded-lg px-3 py-2 ${
                                    message.fromMe ? "bg-primary text-primary-foreground" : "bg-muted"
                                }`}
                            >
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
                className="flex flex-col gap-2 mt-4 border-t border-border bg-background p-4 sticky bottom-0"
            >
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
                                <PopoverContent className="w-full">
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
