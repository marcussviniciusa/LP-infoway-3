// api/meta-conversion.js
const fetch = require('node-fetch');

const PIXEL_ID = '780740704041293';
const ACCESS_TOKEN = 'EAATYDfZBaIVgBOZCIPI6ZBZCxCoOFXMfGLptpJhCZCQkzUZBFZBwIBBdZBjzrOTPXFdZC17aXkAxyvokzJTTO7VRJiiJBt7iFK3cdmAAJZBaEJy9OX9Ys3MsNKCuW19EQ0M3nV1ZBxltssfQHjR5e13Htm0ovcUPT2r1ZCUcC8ZAYUkLbxe3Ivo9d1H4We9s4QKlqJSFf7AZDZD';

module.exports = async (req, res) => {
    console.log('Recebendo requisição para API de Conversão Meta');
    
    // Habilitar CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Tratar preflight request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { eventName, userData = {}, customData = {} } = req.body;
        
        // Capturar IP do cliente
        const clientIp = req.headers['x-forwarded-for']?.split(',')[0].trim() || 
                        req.socket?.remoteAddress;
                        
        console.log('Dados recebidos:', {
            eventName,
            userData,
            customData,
            clientIp
        });

        // Adicionar IP do cliente aos dados do usuário
        if (clientIp) {
            userData.client_ip_address = clientIp;
        }

        const eventData = {
            data: [{
                event_name: eventName,
                event_time: Math.floor(Date.now() / 1000),
                action_source: 'website',
                user_data: userData,
                custom_data: customData
            }]
        };

        console.log('Enviando evento para Meta:', eventData);

        const url = `https://graph.facebook.com/v16.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(eventData),
        });

        const data = await response.json();
        console.log('Resposta da Meta:', data);
        
        res.status(200).json(data);
    } catch (error) {
        console.error('Error sending event:', error);
        res.status(500).json({ 
            error: 'Failed to send event',
            details: error.message
        });
    }
}
