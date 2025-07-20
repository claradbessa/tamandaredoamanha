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

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::apiResource('voluntarios', VoluntarioController::class);
Route::apiResource('alunos', AlunoController::class);
Route::apiResource('aulas', AulaController::class);
Route::apiResource('postagens', PostagemController::class);
Route::apiResource('gestores', GestorController::class);
Route::apiResource('matriculas', MatriculaController::class);
Route::apiResource('frequencias', FrequenciaController::class);
