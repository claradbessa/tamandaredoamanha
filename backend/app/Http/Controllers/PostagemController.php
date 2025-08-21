<?php

namespace App\Http\Controllers;

use App\Models\Postagem;
use App\Services\PostagemService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

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
            // --- LÓGICA DO CLOUDINARY  ---
            if ($request->hasFile('midia')) {
                // 1. Faz o upload do arquivo para a pasta "postagens" no Cloudinary
                $path = $request->file('midia')->store('postagens');

                // 2. Pega a URL segura do arquivo que foi enviado
                // O driver do Cloudinary já retorna a URL completa
                $url = Storage::url($path);

                // 3. Adiciona a URL aos dados que serão salvos no banco
                $validated['midia_url'] = $url;
            }
            // --- FIM DA LÓGICA DO CLOUDINARY ---

            $postagem = $this->postagemService->create($validated);
            $fresh = Postagem::with('voluntario')->findOrFail($postagem->id);
            return response()->json($fresh, 201);

        } catch (\Throwable $e) {
            Log::error('[PostagemController] Erro no store: '.$e->getMessage(), ['trace' => $e->getTraceAsString()]);
            report($e);
            return response()->json(['message' => 'Ocorreu um erro ao criar a postagem.'], 500);
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

            // --- LÓGICA DO CLOUDINARY  ---
            if ($request->hasFile('midia')) {
                // Se já existir uma mídia antiga, podemos deletá-la do Cloudinary
                if ($postagem->midia_url) {
                    // O driver do Cloudinary entende a URL e extrai o ID público para deletar
                    Storage::delete($postagem->midia_url);
                }

                $path = $request->file('midia')->store('postagens');
                $url = Storage::url($path);
                $validated['midia_url'] = $url;
            }
            // --- FIM DA LÓGICA DO CLOUDINARY ---

            $this->postagemService->update($postagem, $validated);
            $fresh = Postagem::with('voluntario')->findOrFail($id);
            return response()->json($fresh, 200);

        } catch (\Throwable $e) {
            Log::error('[PostagemController] Erro no update: '.$e->getMessage(), ['trace' => $e->getTraceAsString()]);
            report($e);
            return response()->json(['message' => 'Ocorreu um erro ao atualizar a postagem.'], 500);
        }
    }

    public function destroy($id)
    {
        Log::info("[PostagemController] Iniciando destroy ID={$id}");
        try {
            $postagem = Postagem::findOrFail($id);

            // --- LÓGICA DO CLOUDINARY ---
            // Antes de deletar o registro do banco, deletamos o arquivo no Cloudinary
            if ($postagem->midia_url) {
                Storage::delete($postagem->midia_url);
            }
            // --- FIM DA LÓGICA DO CLOUDINARY ---

            $this->postagemService->delete($postagem);
            return response()->noContent();

        } catch (\Throwable $e) {
            Log::error('[PostagemController] Erro no destroy: '.$e->getMessage(), ['trace' => $e->getTraceAsString()]);
            report($e);
            return response()->json(['message' => 'Ocorreu um erro ao excluir a postagem.'], 500);
        }
    }
}
