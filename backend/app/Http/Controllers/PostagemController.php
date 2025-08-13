<?php

namespace App\Http\Controllers;

use App\Models\Postagem;
use App\Services\PostagemService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class PostagemController extends Controller
{
    protected $postagemService;

    public function __construct(PostagemService $postagemService)
    {
        $this->postagemService = $postagemService;
    }

    public function index()
    {
        $postagens = Postagem::with('voluntario')
            ->orderByDesc('created_at')
            ->get();

        return response()->json($postagens);
    }

    public function show($id)
    {
        $postagem = Postagem::with('voluntario')->findOrFail($id);
        $postagem->increment('visualizacoes');

        $postagem->load('voluntario');

        return response()->json($postagem);
    }

    public function store(Request $request)
    {
        Log::info('[PostagemController] Iniciando store');

        $validated = $request->validate([
            'titulo'        => 'required|string|max:150',
            'conteudo'      => 'required|string',
            'midia'         => 'nullable|file|mimes:jpg,jpeg,png,gif,mp4|max:20480',
            'publicado'     => 'sometimes|boolean',
            'voluntario_id' => 'required|exists:voluntarios,id',
            'categoria'     => 'nullable|string|max:50',
        ]);

        try {
            $postagem = $this->postagemService->create($validated);

            $fresh = Postagem::with('voluntario')->findOrFail($postagem->id);

            return response()->json($fresh, 201);
        } catch (\Throwable $e) {
            Log::error('[PostagemController] Erro no store: '.$e->getMessage(), ['trace' => $e->getTraceAsString()]);
            report($e);

            return response()->json([
                'message' => 'Ocorreu um erro ao criar a postagem.'
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        Log::info("[PostagemController] Iniciando update ID={$id}");

        $validated = $request->validate([
            'titulo'        => 'sometimes|required|string|max:150',
            'conteudo'      => 'sometimes|required|string',
            'midia'         => 'nullable|file|mimes:jpg,jpeg,png,gif,mp4|max:20480',
            'publicado'     => 'sometimes|boolean',
            'voluntario_id' => 'sometimes|required|exists:voluntarios,id',
            'categoria'     => 'nullable|string|max:50',
        ]);

        try {
            $postagem = Postagem::findOrFail($id);

            $this->postagemService->update($postagem, $validated);

            $fresh = Postagem::with('voluntario')->findOrFail($id);

            return response()->json($fresh, 200);
        } catch (\Throwable $e) {
            Log::error('[PostagemController] Erro no update: '.$e->getMessage(), ['trace' => $e->getTraceAsString()]);
            report($e);

            return response()->json([
                'message' => 'Ocorreu um erro ao atualizar a postagem.'
            ], 500);
        }
    }

    public function destroy($id)
    {
        Log::info("[PostagemController] Iniciando destroy ID={$id}");

        try {
            $postagem = Postagem::findOrFail($id);

            $this->postagemService->delete($postagem);

            $stillExists = Postagem::where('id', $id)->exists();
            if ($stillExists) {
                Log::warning("[PostagemController] Após delete, a postagem ID={$id} ainda existe.");
                return response()->json([
                    'message' => 'Falha ao excluir a postagem.'
                ], 500);
            }

            return response()->noContent();

        } catch (\Throwable $e) {
            Log::error('[PostagemController] Erro no destroy: '.$e->getMessage(), ['trace' => $e->getTraceAsString()]);
            report($e);

            return response()->json([
                'message' => 'Ocorreu um erro ao excluir a postagem.'
            ], 500);
        }
    }
}
