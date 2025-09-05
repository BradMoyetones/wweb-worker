export type WhatsAppStatus = 'loading' | 'qr' | 'ready' | 'auth_failure' | 'disconnected';
export interface WhatsAppContextType {
    status: WhatsAppStatus;
    imgQr: string;
}