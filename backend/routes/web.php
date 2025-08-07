<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/teste-upload', function () {
    $filename = 'teste.txt';
    $content = 'Esse é um teste de escrita.';

    Storage::disk('public')->put($filename, $content);

    return 'Arquivo salvo em: ' . Storage::disk('public')->url($filename);
});
