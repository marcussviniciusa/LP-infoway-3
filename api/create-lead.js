// api/create-lead.js
const fetch = require('node-fetch');

module.exports = async (req, res) => {
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
        const formData = req.body;
        console.log('Recebendo dados do lead:', formData);

        const response = await fetch('https://ixc.infowaynet.com.br/webservice/v1/contato', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic MTM5OjRiZDJhZTk4Mzk3OTA5ZDFlYzEzMWE2NDQ4Y2M4MGNhOGYzYjBlNWY1OWUxYzIwMzAyYzZiM2Y5ODdmZTcyMzg=',
                'Accept': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.text();
        console.log('Resposta da API IXC:', data);

        // Tentar parsear a resposta como JSON
        let jsonResponse;
        try {
            jsonResponse = JSON.parse(data);
        } catch (e) {
            jsonResponse = { text: data };
        }

        if (response.ok) {
            res.status(200).json({ 
                success: true, 
                data: jsonResponse 
            });
        } else {
            throw new Error(`API IXC retornou status ${response.status}: ${data}`);
        }
    } catch (error) {
        console.error('Erro ao criar lead:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
}
