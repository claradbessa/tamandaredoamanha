<?php

namespace App\Http\Controllers;

use App\Models\Postagem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class PostagemController extends Controller
{
    public function index()
    {
        return Postagem::with('voluntario')->latest()->get();
    }

    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'titulo' => 'required|string|max:150',
                'conteudo' => 'required|string',
                'midia' => 'nullable|file|mimes:jpg,jpeg,png,gif,mp4|max:20480',
                'publicado' => 'sometimes|boolean',
                'voluntario_id' => 'required|exists:voluntarios,id',
                'categoria' => 'nullable|string|max:50',
            ]);

            if (isset($validatedData['midia']) && $validatedData['midia']->isValid()) {
                $path = $validatedData['midia']->store('uploads/midia', 'public');
                $validatedData['midia'] = $path;
            }

            $postagem = Postagem::create($validatedData);
            $postagem->load('voluntario');
            return response()->json($postagem, 201);

        } catch (\Throwable $e) {
            Log::error('[PostagemController] Erro no store: ' . $e->getMessage());
            report($e);
            return response()->json(['error' => 'Ocorreu um erro ao criar a postagem.'], 500);
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
        try {
            $validatedData = $request->validate([
                'titulo' => 'sometimes|required|string|max:150',
                'conteudo' => 'sometimes|required|string',
                'midia' => 'nullable|file|mimes:jpg,jpeg,png,gif,mp4|max:20480',
                'publicado' => 'sometimes|boolean',
                'voluntario_id' => 'sometimes|required|exists:voluntarios,id',
                'categoria' => 'nullable|string|max:50',
            ]);

            if (isset($validatedData['midia']) && $validatedData['midia']->isValid()) {
                if ($postagem->midia) {
                    Storage::disk('public')->delete($postagem->midia);
                }
                $path = $validatedData['midia']->store('uploads/midia', 'public');
                $validatedData['midia'] = $path;
            }

            $postagem->update($validatedData);
            $postagem->load('voluntario');
            return response()->json($postagem);

        } catch (\Throwable $e) {
            Log::error('[PostagemController] Erro no update: ' . $e->getMessage());
            report($e);
            return response()->json(['error' => 'Ocorreu um erro ao atualizar a postagem.'], 500);
        }
    }

    public function destroy(Postagem $postagem)
    {
        try {
            if ($postagem->midia) {
                Storage::disk('public')->delete($postagem->midia);
            }
            $postagem->delete();
            return response()->json(null, 204);
        } catch (\Throwable $e) {
            Log::error('[PostagemController] Erro no destroy: ' . $e->getMessage());
            report($e);
            return response()->json(['error' => 'Ocorreu um erro ao excluir a postagem.'], 500);
        }
    }
}
