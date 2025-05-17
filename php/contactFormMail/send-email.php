<?php

// Ustaw nagłówki, aby zezwolić na żądania CORS (jeśli front-end i back-end są na różnych domenach/portach)
// W przypadku tej samej domeny/portu, te nagłówki mogą nie być konieczne,
// ale nie zaszkodzą i mogą być przydatne podczas testowania na localhost.
header('Access-Control-Allow-Origin: *'); // Zmień * na domenę swojej strony w środowisku produkcyjnym dla większego bezpieczeństwa
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
header('Content-Type: application/json'); // Informujemy przeglądarkę, że zwracamy JSON

// Sprawdź, czy żądanie jest typu POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Pobierz dane z żądania POST
    // Używamy file_get_contents('php://input') bo fetch z JS domyślnie wysyła jako 'application/json'
    $json_data = file_get_contents('php://input');
    $data = json_decode($json_data, true);

    // Sprawdź, czy dekodowanie JSON się powiodło i czy dane nie są puste
    if ($data === null) {
        echo json_encode(['success' => false, 'message' => 'Niepoprawny format danych (wymagany JSON).']);
        http_response_code(400); // Bad Request
        exit;
    }

    // Pobierz i oczyść dane
    $name = filter_var($data['name'] ?? '', FILTER_SANITIZE_STRING);
    $email = filter_var($data['email'] ?? '', FILTER_SANITIZE_EMAIL);
    $message = filter_var($data['message'] ?? '', FILTER_SANITIZE_STRING);

    // Adres e-mail, na który mają być wysyłane wiadomości
    $recipient_email = "wiktorialubiato@gmail.com"; // <--- ZMIEŃ TO NA SWÓJ ADRES EMAIL!!!

    // Sprawdź, czy wymagane pola są wypełnione
    if (empty($name) || empty($email) || empty($message)) {
        echo json_encode(['success' => false, 'message' => 'Proszę wypełnić wszystkie wymagane pola.']);
        http_response_code(400); // Bad Request
        exit;
    }

    // Sprawdź poprawność formatu adresu e-mail
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'message' => 'Niepoprawny format adresu email.']);
         http_response_code(400); // Bad Request
        exit;
    }

    // Temat wiadomości e-mail
    $subject = "Wiadomość ze strony kontaktowej od: " . $name;

    // Treść wiadomości e-mail
    $email_body = "Imię: " . $name . "\n";
    $email_body .= "Email: " . $email . "\n\n";
    $email_body .= "Wiadomość:\n" . $message;

    // Nagłówki e-mail
    $headers = "From: " . $name . " <" . $email . ">\r\n";
    $headers .= "Reply-To: " . $email . "\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-type: text/plain; charset=UTF-8\r\n"; // Upewnij się, że kodowanie jest UTF-8

    // Wysłanie wiadomości e-mail
    // Funkcja mail() może wymagać konfiguracji na serwerze hostingowym
    if (mail($recipient_email, $subject, $email_body, $headers)) {
        // Sukces
        echo json_encode(['success' => true, 'message' => 'Wiadomość została wysłana pomyślnie.']);
        http_response_code(200); // OK
    } else {
        // Błąd wysyłki poczty
        echo json_encode(['success' => false, 'message' => 'Wystąpił błąd podczas wysyłki wiadomości e-mail. Spróbuj ponownie później.']);
        http_response_code(500); // Internal Server Error
    }

} else {
    // Jeśli żądanie nie jest typu POST
    echo json_encode(['success' => false, 'message' => 'Metoda żądania nie jest dozwolona.']);
    http_response_code(405); // Method Not Allowed
}

?>