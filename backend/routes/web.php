<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

Route::get('/', function () {
    return view('welcome');
});

// Não esquece de tirar essa parte depois
Route::get('/teste-upload', function () {
    $filename = 'teste.txt';
    $content = 'Esse é um teste de escrita.';

    Storage::disk('public')->put($filename, $content);

    return 'Arquivo salvo em: ' . Storage::disk('public')->url($filename);
});

Route::get('/teste-limite', function () {
    return '
        <form method="POST" action="/teste-limite" enctype="multipart/form-data">
            <input type="file" name="arquivo" />
            <button type="submit">Enviar</button>
        </form>
    ';
});

Route::post('/teste-limite', function (Request $request) {
    if (!$request->hasFile('arquivo')) {
        return 'Nenhum arquivo enviado.';
    }

    $file = $request->file('arquivo');

    return 'Arquivo recebido: ' . $file->getClientOriginalName() .
           ' | Tamanho: ' . $file->getSize() . ' bytes (' . round($file->getSize()/1024, 2) . ' KB)';
});
