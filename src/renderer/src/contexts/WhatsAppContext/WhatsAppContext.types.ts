import { Chat, ClientInfo } from "whatsapp-web.js";

export type WhatsAppStatus = 'loading' | 'qr' | 'ready' | 'auth_failure' | 'disconnected';
export interface WhatsAppContextType {
    status: WhatsAppStatus;
    imgQr: string;
    user: ClientInfo & {profilePic: string | null} | null;
    chats: Chat[];
    chatSelected: string;
    setChatSelected: React.Dispatch<React.SetStateAction<string>>
}