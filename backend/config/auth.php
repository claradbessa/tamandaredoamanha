<?php

return [
    'defaults' => [
        'guard' => 'web',
        'passwords' => 'users',
    ],

    'guards' => [
        'web' => [
            'driver' => 'session',
            'provider' => 'users',
        ],
        // O guarda 'api' agora é o responsável por autenticar os voluntários
        'api' => [
            'driver' => 'sanctum',
            'provider' => 'voluntarios',
        ],
    ],

    'providers' => [
        // Mantemos o provider 'users' padrão do Laravel
        'users' => [
            'driver' => 'eloquent',
            'model' => App\Models\User::class,
        ],
        // Adicionamos nosso provider para 'voluntarios'
        'voluntarios' => [
            'driver' => 'eloquent',
            'model' => App\Models\Voluntario::class,
        ],
    ],

    'passwords' => [
        'users' => [
            'provider' => 'users',
            'table' => 'password_reset_tokens',
            'expire' => 60,
            'throttle' => 60,
        ],
    ],

    'password_timeout' => 10800,
];
