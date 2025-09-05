// src/main/lib/whatsappClient.js
import { Client, LocalAuth } from 'whatsapp-web.js';
import path from 'path';
import { app } from 'electron'; // Importa 'app' para acceder a rutas del sistema

let client: Client | null = null;

// Obtén el path para guardar los archivos de sesión
// Utiliza una ubicación segura y persistente en el sistema del usuario
const userDataPath = app.getPath('userData');
const sessionPath = path.join(userDataPath, 'wwebjs_auth');

export const initializeClient = (webContents: Electron.WebContents) => {
    return new Promise((resolve, reject) => {
        if (client) {
            console.log('Client already initialized.');
            resolve(client);
            return;
        }

        console.log('Initializing WhatsApp client...');
        client = new Client({
            authStrategy: new LocalAuth({
                clientId: 'wweb-worker',
                dataPath: sessionPath, // Ruta donde se guardarán los datos de la sesión
            }),
            puppeteer: {
                headless: true, // `true` para no mostrar el navegador, `false` para depurar
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                ],
            }
        });

        // Escuchadores de eventos
        client.on('qr', (qr) => {
            console.log('QR RECEIVED', qr);
            webContents.send('whatsapp-status', { status: 'qr', qr });
        });

        client.on('ready', async() => {
            console.log('Client is ready!');
            if(!client) return

            // Perfil del usuario actual
            const userInfo = client.info;
            webContents.send('whatsapp-user', userInfo);

            // Chats del usuario
            const chats = await client.getChats();
            webContents.send('whatsapp-chats', chats);

            webContents.send('whatsapp-status', { status: 'ready' });
            resolve(client);
        });

        // Nuevo mensaje
        client.on('message', (msg) => {
            webContents.send('whatsapp-message', msg);
        });

        client.on('authenticated', (session) => {
            console.log('AUTHENTICATED', session);
            webContents.send('whatsapp-status', { status: 'authenticated' });
        });

        client.on('auth_failure', msg => {
            console.error('AUTHENTICATION FAILURE', msg);
            webContents.send('whatsapp-status', { status: 'auth_failure', error: msg });
            reject(new Error(msg));
        });

        client.on('disconnected', (reason) => {
            console.log('Client disconnected', reason);
            webContents.send('whatsapp-status', { status: 'disconnected', reason });
        });
        // ------

        client.initialize().catch(err => {
            console.error('Initialization failed:', err);
            reject(err);
        });
    });
};