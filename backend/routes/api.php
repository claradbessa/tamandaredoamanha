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
use Illuminate\Http\Response;

// Rotas Públicas de Autenticação
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Adiciona uma rota para responder aos pedidos de verificação OPTIONS
Route::options('/postagens', function () {
    return response('', Response::HTTP_NO_CONTENT)
        ->header('Access-Control-Allow-Origin', request()->header('Origin'))
        ->header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT, DELETE')
        ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        ->header('Access-Control-Allow-Credentials', 'true');
});

// Adiciona uma rota para responder aos pedidos de verificação OPTIONS
Route::options('/postagens/{postagem?}', function () {
    return response()->noContent();
});

// Grupo de Rotas Protegidas
Route::middleware('auth:sanctum')->group(function () {

    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::get('/aulas/{aula}/alunos', [AulaController::class, 'getAlunos']);
    Route::get('/aulas-lista', [AulaController::class, 'getListaAulas']);

    // Rotas de Recursos (CRUDs)
    Route::apiResource('voluntarios', VoluntarioController::class);
    Route::apiResource('alunos', AlunoController::class);
    Route::apiResource('aulas', AulaController::class);
    Route::apiResource('postagens', PostagemController::class);
    Route::apiResource('gestores', GestorController::class);
    Route::apiResource('matriculas', MatriculaController::class);
    Route::apiResource('frequencias', FrequenciaController::class);
});
