<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie', 'login', 'register'],
    'allowed_methods' => ['*'],
    'allowed_origins' => array_map('trim', explode(',', env('CORS_ALLOWED_ORIGINS', '*'))),
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
