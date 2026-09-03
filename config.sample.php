<?php
/**
 * Скопировать на сервере в /home/<аккаунт>/config.php —
 * то есть НА УРОВЕНЬ ВЫШЕ public_html, чтобы файл не отдавался по HTTP.
 * form.php ищет его по пути ../config.php.
 */

return [
    // Куда приходят заявки
    'to' => 'info@биокат.рф',

    // От чьего имени уходит письмо (должен совпадать с ящиком SMTP)
    'from' => 'site@биокат.рф',
    'from_name' => 'Сайт биокат.рф',

    // SMTP хостинга Beget
    'smtp_host' => 'smtp.beget.com',
    'smtp_port' => 2525,
    'smtp_user' => 'site@биокат.рф',
    'smtp_password' => 'ЗАМЕНИТЬ',
    'smtp_secure' => 'tls', // tls | ssl | none

    // Домены, с которых принимаем отправку формы
    'allowed_origins' => [
        'https://биокат.рф',
        'https://xn--80abvit0a.xn--p1ai',
    ],
];
