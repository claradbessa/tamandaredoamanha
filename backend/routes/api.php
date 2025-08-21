<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AlunoController;
use App\Http\Controllers\AulaController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\FrequenciaController;
use App\Http\Controllers\GestorController;
use App\Http\Controllers\MatriculaController;
use App\Http\Controllers\PostagemController;
use App\Http\Controllers\VoluntarioController;
use App\Http\Controllers\GaleriaController;

/*
|--------------------------------------------------------------------------
| Rota de Teste Pública (Debug)
|--------------------------------------------------------------------------
| Essa rota serve apenas para verificar se o Laravel está recebendo
| corretamente as requisições GET e POST com multipart/form-data.
*/
Route::match(['get', 'post'], '/galeria-debug', function (Request $request) {
    \Illuminate\Support\Facades\Log::info('📥 Recebi requisição em /galeria-debug', [
        'method'  => $request->method(),
        'all'     => $request->all(),
        'hasFile' => $request->hasFile('imagens'),
    ]);

    return response()->json([
        'ok'      => true,
        'method'  => $request->method(),
        'hasFile' => $request->hasFile('imagens'),
        'files'   => array_map(
            fn($f) => $f->getClientOriginalName(),
            (array) $request->file('imagens')
        ),
    ]);
});

// Rotas públicas da galeria
    Route::get('/galeria', [GaleriaController::class, 'index']);

// Rotas PÚBLICAS para Postagens (Blog)
Route::get('/postagens', [PostagemController::class, 'index']);
Route::get('/postagens/{id}', [PostagemController::class, 'show']);

// Rotas Públicas de Autenticação
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Grupo de Rotas Protegidas
Route::middleware('auth:sanctum')->group(function () {

    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::get('/aulas/{aula}/alunos', [AulaController::class, 'getAlunos']);
    Route::get('/aulas-lista', [AulaController::class, 'getListaAulas']);

    // Rotas da galeria
    Route::post('/galeria', [GaleriaController::class, 'store']);
    Route::delete('/galeria/{galeriaImagem}', [GaleriaController::class, 'destroy']);

    // Rotas de Postagens (Gerenciamento)
    Route::post('/postagens', [PostagemController::class, 'store']);
    Route::put('/postagens/{id}', [PostagemController::class, 'update']);
    Route::delete('/postagens/{id}', [PostagemController::class, 'destroy']);

    // Rotas de Recursos (CRUDs)
    Route::apiResource('voluntarios', VoluntarioController::class);
    Route::apiResource('alunos', AlunoController::class);
    Route::apiResource('aulas', AulaController::class);
    // Route::apiResource('postagens', PostagemController::class);
    Route::apiResource('gestores', GestorController::class);
    Route::apiResource('matriculas', MatriculaController::class);
    Route::apiResource('frequencias', FrequenciaController::class);
    Route::post('frequencias/batch', [FrequenciaController::class, 'storeBatch']);
});

// --- ROTA DE DIAGNÓSTICO TEMPORÁRIA ---
// Para verificar as configurações do PHP no servidor.
Route::get('/debug-php', function () {
    $uploadLimit = ini_get('upload_max_filesize');
    $postLimit = ini_get('post_max_size');
    $memoryLimit = ini_get('memory_limit');

    return response()->json([
        'upload_max_filesize' => $uploadLimit,
        'post_max_size' => $postLimit,
        'memory_limit' => $memoryLimit,
    ]);
});
