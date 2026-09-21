<?php
/**
 * Скопировать на сервере в /home/<аккаунт>/config.php —
 * то есть НА УРОВЕНЬ ВЫШЕ public_html, чтобы файл не отдавался по HTTP.
 * form.php ищет его по пути ../config.php.
 */

// Адреса пишутся в punycode. SMTP без расширения SMTPUTF8 не принимает
// кириллицу в MAIL FROM и RCPT TO — с адресом «info@биокат.рф» письмо
// молча не уйдёт, и выглядеть это будет как недоступный SMTP.
// xn--80abvit0a.xn--p1ai — это и есть биокат.рф.
return [
    // Куда приходят заявки
    'to' => 'info@xn--80abvit0a.xn--p1ai',

    // От чьего имени уходит письмо (должен совпадать с ящиком SMTP)
    'from' => 'site@xn--80abvit0a.xn--p1ai',
    'from_name' => 'Сайт биокат.рф',

    // SMTP хостинга Beget
    'smtp_host' => 'smtp.beget.com',
    'smtp_port' => 2525,
    'smtp_user' => 'site@xn--80abvit0a.xn--p1ai',
    'smtp_password' => 'ЗАМЕНИТЬ',
    'smtp_secure' => 'tls', // tls | ssl | none

    // Домены, с которых принимаем отправку формы
    'allowed_origins' => [
        'https://биокат.рф',
        'https://xn--80abvit0a.xn--p1ai',
    ],
];
