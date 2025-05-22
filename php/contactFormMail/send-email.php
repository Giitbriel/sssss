<?php

// Ustaw nagłówki, aby zezwolić na żądania CORS (jeśli front-end i back-end są na różnych domenach/portach)
// W przypadku tej samej domeny/portu, te nagłówki mogą nie być konieczne,
// ale nie zaszkodzą i mogą być przydatne podczas testowania na localhost.
// Ustaw nagłówki, aby zezwolić na żądania CORS (opcjonalne przy localhost)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
header('Content-Type: application/json');

// Sprawdź, czy żądanie jest typu POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Pobierz dane JSON z żądania
    $json_data = file_get_contents('php://input');
    $data = json_decode($json_data, true);

    if ($data === null) {
        echo json_encode(['success' => false, 'message' => 'Niepoprawny format danych (wymagany JSON).']);
        http_response_code(400);
        exit;
    }

    // -------------------- 🔐 Google reCAPTCHA --------------------
    $recaptcha_response = $data['recaptcha'] ?? '';
    if (empty($recaptcha_response)) {
        echo json_encode(['success' => false, 'message' => 'Proszę zaznaczyć reCAPTCHA.']);
        http_response_code(400);
        exit;
    }

    $secret_key = 'TWOJ_SECRET_KEY'; // 🔁 ← TUTAJ WSTAW SWÓJ SEKRETNY KLUCZ z Google
    $verify_url = "https://www.google.com/recaptcha/api/siteverify?secret={$secret_key}&response={$recaptcha_response}";
    $verify_response = file_get_contents($verify_url);
    $captcha_success = json_decode($verify_response);

    if (!$captcha_success || !$captcha_success->success) {
        echo json_encode(['success' => false, 'message' => 'Weryfikacja reCAPTCHA nie powiodła się.']);
        http_response_code(400);
        exit;
    }
    // -------------------- ✅ reCAPTCHA OK --------------------

    // Oczyść i sprawdź dane formularza
    $name = filter_var($data['name'] ?? '', FILTER_SANITIZE_STRING);
    $email = filter_var($data['email'] ?? '', FILTER_SANITIZE_EMAIL);
    $message = filter_var($data['message'] ?? '', FILTER_SANITIZE_STRING);

    if (empty($name) || empty($email) || empty($message)) {
        echo json_encode(['success' => false, 'message' => 'Proszę wypełnić wszystkie wymagane pola.']);
        http_response_code(400);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'message' => 'Niepoprawny format adresu email.']);
        http_response_code(400);
        exit;
    }

    $recipient_email = "wiktorialubiato@gmail.com"; // ← TWÓJ ADRES DO ODBIORU

    $subject = "Wiadomość ze strony kontaktowej od: " . $name;
    $email_body = "Imię: " . $name . "\n";
    $email_body .= "Email: " . $email . "\n\n";
    $email_body .= "Wiadomość:\n" . $message;

    $headers = "From: " . $name . " <" . $email . ">\r\n";
    $headers .= "Reply-To: " . $email . "\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-type: text/plain; charset=UTF-8\r\n";

    if (mail($recipient_email, $subject, $email_body, $headers)) {
        echo json_encode(['success' => true, 'message' => 'Wiadomość została wysłana pomyślnie.']);
        http_response_code(200);
    } else {
        echo json_encode(['success' => false, 'message' => 'Wystąpił błąd podczas wysyłki wiadomości e-mail.']);
        http_response_code(500);
    }

} else {
    echo json_encode(['success' => false, 'message' => 'Metoda żądania nie jest dozwolona.']);
    http_response_code(405);
}
?>
