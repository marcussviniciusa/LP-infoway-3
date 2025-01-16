// api/create-lead.js
const fetch = require('node-fetch');
const cors = require('cors');

const corsMiddleware = cors({
    origin: '*',
    methods: ['POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
});

module.exports = async (req, res) => {
    // Aplicar CORS
    await new Promise((resolve, reject) => {
        corsMiddleware(req, res, (result) => {
            if (result instanceof Error) {
                return reject(result);
            }
            return resolve(result);
        });
    });

    // Tratar preflight request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    try {
        const formData = req.body;
        console.log('Recebendo dados do lead:', formData);

        // Validar dados obrigatórios
        const requiredFields = ['nome', 'email', 'fone_celular', 'cnpj_cpf'];
        const missingFields = requiredFields.filter(field => !formData[field]);
        
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                error: `Campos obrigatórios faltando: ${missingFields.join(', ')}`
            });
        }

        const response = await fetch('https://ixc.infowaynet.com.br/webservice/v1/contato', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic MTM5OjRiZDJhZTk4Mzk3OTA5ZDFlYzEzMWE2NDQ4Y2M4MGNhOGYzYjBlNWY1OWUxYzIwMzAyYzZiM2Y5ODdmZTcyMzg=',
                'Accept': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const responseText = await response.text();
        console.log('Resposta bruta da API IXC:', responseText);

        let jsonResponse;
        try {
            jsonResponse = JSON.parse(responseText);
        } catch (e) {
            console.error('Erro ao parsear resposta:', e);
            jsonResponse = { text: responseText };
        }

        if (response.ok) {
            console.log('Lead criado com sucesso:', jsonResponse);
            return res.status(200).json({
                success: true,
                data: jsonResponse
            });
        } else {
            console.error('Erro da API IXC:', {
                status: response.status,
                response: jsonResponse
            });
            throw new Error(`API IXC retornou status ${response.status}: ${responseText}`);
        }
    } catch (error) {
        console.error('Erro ao criar lead:', error);
        return res.status(500).json({
            success: false,
            error: error.message || 'Erro interno do servidor'
        });
    }
}
