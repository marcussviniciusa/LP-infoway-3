<?php

function sendMetaConversionEvent($eventName, $userData = [], $customData = []) {
    $pixelId = '780740704041293';
    $accessToken = 'EAATYDfZBaIVgBO5M8pDoytbLOZAwvlTZCaiWWuXMNwyygeRbZCXrQ2DBgUJ37s5Ie8YC9blFKe2aAA7XgpRL...';
    
    $url = "https://graph.facebook.com/v16.0/{$pixelId}/events?access_token={$accessToken}";
    
    $data = [
        'data' => [
            [
                'event_name' => $eventName,
                'event_time' => time(),
                'action_source' => 'website',
                'user_data' => $userData,
                'custom_data' => $customData
            ]
        ]
    ];
    
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $response = curl_exec($ch);
    curl_close($ch);
    
    return json_decode($response, true);
}

// Exemplo de uso para evento de Lead
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['form_submit'])) {
    $userData = [
        'client_user_agent' => $_SERVER['HTTP_USER_AGENT']
    ];
    
    if (isset($_POST['email'])) {
        $userData['em'] = [hash('sha256', strtolower(trim($_POST['email'])))];
    }
    
    if (isset($_POST['phone'])) {
        $userData['ph'] = [hash('sha256', preg_replace('/[^0-9]/', '', $_POST['phone']))];
    }
    
    $customData = [
        'currency' => 'BRL',
        'value' => 0,
        'lead_type' => 'Formulário de Contato'
    ];
    
    sendMetaConversionEvent('Lead', $userData, $customData);
}
?>
