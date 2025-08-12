<?php

namespace App\Http\Controllers;

use App\Models\Postagem;
use App\Services\PostagemService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PostagemController extends Controller
{
    protected $postagemService;

    public function __construct(PostagemService $postagemService)
    {
        $this->postagemService = $postagemService;
    }

    public function index()
    {
        $postagens = $this->postagemService->getAll();
        return response()->json($postagens);
    }

    public function store(Request $request)
    {
        Log::info('[PostagemController] Iniciando criação de postagem.');

        try {
            $validatedData = $request->validate([
                'titulo' => 'required|string|max:150',
                'conteudo' => 'required|string',
                'midia' => 'nullable|file|mimes:jpg,jpeg,png,gif,mp4|max:20480',
                'publicado' => 'sometimes|boolean',
                'voluntario_id' => 'required|exists:voluntarios,id',
                'categoria' => 'nullable|string|max:50',
            ]);

            // Se houver mídia no request, adiciona ao array de dados
            if ($request->hasFile('midia')) {
                $validatedData['midia'] = $request->file('midia');
            }

            $postagem = $this->postagemService->create($validatedData);
            $postagem->load('voluntario');

            return response()->json($postagem, 201);

        } catch (\Throwable $e) {
            Log::error('[PostagemController] Erro no store: ' . $e->getMessage());
            report($e);
            return response()->json([
                'error' => 'Ocorreu um erro ao criar a postagem.'
            ], 500);
        }
    }

    public function show(Postagem $postagem)
    {
        $postagem->increment('visualizacoes');
        $postagem->load('voluntario');
        return response()->json($postagem);
    }

    public function update(Request $request, Postagem $postagem)
    {
        Log::info("[PostagemController] Atualizando postagem ID: {$postagem->id}");

        try {
            $validatedData = $request->validate([
                'titulo' => 'sometimes|required|string|max:150',
                'conteudo' => 'sometimes|required|string',
                'midia' => 'nullable|file|mimes:jpg,jpeg,png,gif,mp4|max:20480',
                'publicado' => 'sometimes|boolean',
                'voluntario_id' => 'sometimes|required|exists:voluntarios,id',
                'categoria' => 'nullable|string|max:50',
            ]);

            if ($request->hasFile('midia')) {
                $validatedData['midia'] = $request->file('midia');
            }

            $updatedPostagem = $this->postagemService->update($postagem, $validatedData);
            $updatedPostagem->load('voluntario');

            return response()->json($updatedPostagem);

        } catch (\Throwable $e) {
            Log::error('[PostagemController] Erro no update: ' . $e->getMessage());
            report($e);
            return response()->json([
                'error' => 'Ocorreu um erro ao atualizar a postagem.'
            ], 500);
        }
    }

    public function destroy(Postagem $postagem)
    {
        try {
            $this->postagemService->delete($postagem);
            return response()->json(null, 204);
        } catch (\Throwable $e) {
            Log::error('[PostagemController] Erro no destroy: ' . $e->getMessage());
            report($e);
            return response()->json([
                'error' => 'Ocorreu um erro ao excluir a postagem.'
            ], 500);
        }
    }
}
