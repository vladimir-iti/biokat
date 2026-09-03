<?php
/**
 * Минимальный SMTP-клиент.
 *
 * Отдельная библиотека здесь не нужна: задача одна — отправить одно письмо
 * через SMTP хостинга с обязательным TLS. Через mail() письма с формы
 * стабильно уходят в спам, поэтому SMTP обязателен, а mail() остаётся
 * запасным вариантом в form.php.
 */

declare(strict_types=1);

function smtp_read($socket, int $expected): bool
{
    $response = '';
    while (($line = fgets($socket, 515)) !== false) {
        $response .= $line;
        if (strlen($line) < 4 || $line[3] === ' ') {
            break;
        }
    }
    return (int) substr($response, 0, 3) === $expected;
}

function smtp_say($socket, string $command, int $expected): bool
{
    fwrite($socket, $command . "\r\n");
    return smtp_read($socket, $expected);
}

/**
 * @param array{smtp_host:string,smtp_port:int,smtp_user:string,smtp_password:string,smtp_secure:string,from:string} $config
 * @param list<string> $headers
 */
function smtp_send(array $config, string $to, string $subject, array $headers, string $body): bool
{
    if (($config['smtp_host'] ?? '') === '') {
        return false;
    }

    $secure = $config['smtp_secure'] ?? 'tls';
    $host = $secure === 'ssl' ? 'ssl://' . $config['smtp_host'] : $config['smtp_host'];

    $socket = @stream_socket_client(
        $host . ':' . $config['smtp_port'],
        $errno,
        $errstr,
        20,
        STREAM_CLIENT_CONNECT
    );
    if ($socket === false) {
        return false;
    }
    stream_set_timeout($socket, 20);

    $ok = smtp_read($socket, 220)
        && smtp_say($socket, 'EHLO ' . ($_SERVER['SERVER_NAME'] ?? 'localhost'), 250);

    if ($ok && $secure === 'tls') {
        $ok = smtp_say($socket, 'STARTTLS', 220)
            && stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)
            && smtp_say($socket, 'EHLO ' . ($_SERVER['SERVER_NAME'] ?? 'localhost'), 250);
    }

    if ($ok) {
        $ok = smtp_say($socket, 'AUTH LOGIN', 334)
            && smtp_say($socket, base64_encode($config['smtp_user']), 334)
            && smtp_say($socket, base64_encode($config['smtp_password']), 235);
    }

    if ($ok) {
        $ok = smtp_say($socket, 'MAIL FROM:<' . $config['from'] . '>', 250)
            && smtp_say($socket, 'RCPT TO:<' . $to . '>', 250)
            && smtp_say($socket, 'DATA', 354);
    }

    if ($ok) {
        $encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
        $message = implode("\r\n", [
            'To: ' . $to,
            'Subject: ' . $encodedSubject,
            'Date: ' . date('r'),
            ...$headers,
            '',
            $body,
        ]);
        // Точка в начале строки экранируется по требованию протокола
        $message = preg_replace('/^\./m', '..', $message) ?? $message;
        $ok = smtp_say($socket, $message . "\r\n.", 250);
    }

    @smtp_say($socket, 'QUIT', 221);
    fclose($socket);

    return $ok;
}
