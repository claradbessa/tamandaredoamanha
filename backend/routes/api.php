<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\VoluntarioController;
use App\Http\Controllers\AlunoController;
use App\Http\Controllers\AulaController;
use App\Http\Controllers\PostagemController;
use App\Http\Controllers\GestorController;
use App\Http\Controllers\MatriculaController;
use App\Http\Controllers\FrequenciaController;
use App\Http\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Rotas Públicas
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Rotas de Recursos
Route::apiResource('voluntarios', VoluntarioController::class);
Route::apiResource('alunos', AlunoController::class);
Route::apiResource('aulas', AulaController::class);
Route::apiResource('postagens', PostagemController::class);
Route::apiResource('gestores', GestorController::class);
Route::apiResource('matriculas', MatriculaController::class);
Route::apiResource('frequencias', FrequenciaController::class);

// Rota de Usuário Autenticado
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
