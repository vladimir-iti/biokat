<?php
/**
 * Обработчик форм сайта биокат.рф
 *
 * Единственная серверная точка на всём сайте: остальное — статика.
 * Данные никуда не сохраняются — письмо уходит на почту и всё.
 *
 * Настройки лежат в config.php ЗА пределами public_html (см. config.sample.php).
 *
 * Требуется PHP 8.1 или новее.
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

const MAX_FILE_BYTES = 10 * 1024 * 1024;
const MIN_ELAPSED_SECONDS = 3;
const RATE_LIMIT_SECONDS = 30;

$allowedExtensions = ['pdf', 'dwg', 'xls', 'xlsx', 'zip', 'rar', '7z'];

function fail(string $message, int $code = 400): never
{
    http_response_code($code);
    echo json_encode(['ok' => false, 'error' => $message], JSON_UNESCAPED_UNICODE);
    exit;
}

function clean(string $value, int $limit = 2000): string
{
    $value = str_replace(["\r", "\0"], '', $value);
    $value = trim($value);
    return mb_substr($value, 0, $limit);
}

/** Защита от подстановки заголовков через поля формы */
function headerSafe(string $value): string
{
    return trim(str_replace(["\r", "\n", "\t"], ' ', $value));
}

function loadConfig(): array
{
    foreach ([__DIR__ . '/../config.php', __DIR__ . '/config.php'] as $path) {
        if (is_readable($path)) {
            $config = require $path;
            if (is_array($config)) {
                return $config;
            }
        }
    }
    fail('Форма не настроена на сервере', 500);
}

// --- Проверки запроса -------------------------------------------------------

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    fail('Метод не поддерживается', 405);
}

$config = loadConfig();

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '' && !in_array($origin, $config['allowed_origins'] ?? [], true)) {
    fail('Запрос с чужого адреса', 403);
}

// Ловушка для ботов
if (clean((string) ($_POST['company_website'] ?? '')) !== '') {
    // Молча делаем вид, что всё хорошо: бот не должен понять, что распознан
    echo json_encode(['ok' => true], JSON_UNESCAPED_UNICODE);
    exit;
}

if ((int) ($_POST['elapsed'] ?? 0) < MIN_ELAPSED_SECONDS) {
    fail('Форма заполнена слишком быстро');
}

// Ограничение частоты по IP. Метка ставится только после успешной отправки
// (см. конец файла): иначе заявка, отклонённая по незаполненному полю,
// запирала бы форму на полминуты ровно в тот момент, когда человек
// исправляет ошибку и жмёт «Отправить» второй раз.
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$stamp = sys_get_temp_dir() . '/biokat_' . md5($ip);
if (is_file($stamp) && (time() - (int) filemtime($stamp)) < RATE_LIMIT_SECONDS) {
    fail('Слишком часто. Подождите полминуты', 429);
}

// --- Поля -------------------------------------------------------------------

$name = clean((string) ($_POST['name'] ?? ''), 120);
$phone = clean((string) ($_POST['phone'] ?? ''), 40);
$email = clean((string) ($_POST['email'] ?? ''), 160);
$message = clean((string) ($_POST['message'] ?? ''), 4000);
$subject = clean((string) ($_POST['subject'] ?? 'Заявка с сайта'), 120);
$consent = ($_POST['consent'] ?? '') === 'yes';

if ($name === '') {
    fail('Укажите имя');
}
if ($phone === '' || preg_match('/\d/u', $phone) !== 1) {
    fail('Укажите телефон');
}
if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    fail('Проверьте адрес электронной почты');
}
if (!$consent) {
    fail('Нужно согласие на обработку персональных данных');
}

// --- Вложение ---------------------------------------------------------------

$attachment = null;
if (!empty($_FILES['file']['name']) && ($_FILES['file']['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_NO_FILE) {
    if ($_FILES['file']['error'] !== UPLOAD_ERR_OK) {
        fail('Файл не загрузился, попробуйте ещё раз');
    }
    if ($_FILES['file']['size'] > MAX_FILE_BYTES) {
        fail('Файл больше 10 МБ');
    }

    $original = (string) $_FILES['file']['name'];
    $extension = strtolower(pathinfo($original, PATHINFO_EXTENSION));
    if (!in_array($extension, $allowedExtensions, true)) {
        fail('Такой тип файла не принимаем: нужен PDF, DWG, XLS, ZIP');
    }

    $content = file_get_contents($_FILES['file']['tmp_name']);
    if ($content === false) {
        fail('Файл не прочитался', 500);
    }

    // \s в классе символов пропускал бы перевод строки, а имя файла попадает
    // в заголовки MIME-части — там перенос строки означает новый заголовок
    $safeName = preg_replace('/[^\w .\-()]+/u', '_', $original);

    $attachment = [
        'name' => $safeName !== null && $safeName !== '' ? $safeName : "spec.$extension",
        'content' => $content,
    ];
}

// --- Письмо -----------------------------------------------------------------

$lines = [
    "Тема: $subject",
    "Имя: $name",
    "Телефон: $phone",
    'E-mail: ' . ($email !== '' ? $email : '—'),
    '',
    'Задача:',
    $message !== '' ? $message : '—',
    '',
    '---',
    'Страница: ' . clean((string) ($_SERVER['HTTP_REFERER'] ?? '—'), 300),
    'Время: ' . date('d.m.Y H:i'),
    'IP: ' . $ip,
];
if ($attachment !== null) {
    $lines[] = 'Вложение: ' . $attachment['name'];
}
$body = implode("\n", $lines);

$boundary = 'b' . bin2hex(random_bytes(12));
$mailSubject = headerSafe("$subject — $name");

$headers = [
    'From: ' . $config['from_name'] . ' <' . $config['from'] . '>',
    'Reply-To: ' . ($email !== '' ? headerSafe($email) : $config['from']),
    'MIME-Version: 1.0',
    'Content-Type: multipart/mixed; boundary="' . $boundary . '"',
];

$parts = [
    "--$boundary",
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    chunk_split(base64_encode($body)),
];

if ($attachment !== null) {
    $parts[] = "--$boundary";
    $parts[] = 'Content-Type: application/octet-stream; name="' . $attachment['name'] . '"';
    $parts[] = 'Content-Transfer-Encoding: base64';
    $parts[] = 'Content-Disposition: attachment; filename="' . $attachment['name'] . '"';
    $parts[] = '';
    $parts[] = chunk_split(base64_encode($attachment['content']));
}

$parts[] = "--$boundary--";
$mimeBody = implode("\r\n", $parts);

require_once __DIR__ . '/smtp.php';

$sent = smtp_send($config, $config['to'], $mailSubject, $headers, $mimeBody);

if (!$sent) {
    // Запасной путь: если SMTP недоступен, пробуем обычную отправку
    $sent = @mail(
        $config['to'],
        '=?UTF-8?B?' . base64_encode($mailSubject) . '?=',
        $mimeBody,
        implode("\r\n", $headers)
    );
}

if (!$sent) {
    fail('Письмо не ушло. Позвоните нам, пожалуйста', 502);
}

@touch($stamp);

echo json_encode(['ok' => true], JSON_UNESCAPED_UNICODE);
