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

// Rota de teste pública (sem auth) só para debug
Route::post('/galeria-teste', function (Request $request) {
    \Illuminate\Support\Facades\Log::info('📥 Recebi POST em /galeria-teste', [
        'all' => $request->all(),
        'hasFile' => $request->hasFile('imagens')
    ]);
    return response()->json([
        'ok' => true,
        'hasFile' => $request->hasFile('imagens'),
        'files' => array_map(fn($f) => $f->getClientOriginalName(), (array) $request->file('imagens'))
    ]);
});

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

    // Rotas da galeria (originais)
    Route::get('/galeria', [GaleriaController::class, 'index']);
    Route::post('/galeria', [GaleriaController::class, 'store']);
    Route::delete('/galeria/{galeriaImagem}', [GaleriaController::class, 'destroy']);

    // Rotas de Recursos (CRUDs)
    Route::apiResource('voluntarios', VoluntarioController::class);
    Route::apiResource('alunos', AlunoController::class);
    Route::apiResource('aulas', AulaController::class);
    Route::apiResource('postagens', PostagemController::class);
    Route::apiResource('gestores', GestorController::class);
    Route::apiResource('matriculas', MatriculaController::class);
    Route::apiResource('frequencias', FrequenciaController::class);
});
