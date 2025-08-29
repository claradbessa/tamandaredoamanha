<?php

namespace App\Http\Controllers;

use App\Models\Postagem;
use App\Services\PostagemService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
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
        $postagens = Postagem::with('voluntario')->orderByDesc('created_at')->get();
        return response()->json($postagens);
    }

    public function show($id)
    {
        $postagem = Postagem::with('voluntario')->findOrFail($id);
        return response()->json($postagem);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'titulo'            => 'required|string|max:150',
            'conteudo'          => 'required|string',
            'voluntario_id'     => 'required|exists:voluntarios,id',
            'midia_url'         => 'nullable|url',
            'midia_public_id'   => 'nullable|string',
        ]);

        $postagem = $this->postagemService->create($validated);
        $fresh = Postagem::with('voluntario')->findOrFail($postagem->id);

        return response()->json($fresh, 201);
    }

    public function update(Request $request, $id)
    {
        $postagem = Postagem::findOrFail($id);

        $validated = $request->validate([
            'titulo'            => 'sometimes|string|max:150',
            'conteudo'          => 'sometimes|string',
            'voluntario_id'     => 'sometimes|exists:voluntarios,id',
            'midia_url'         => 'nullable|url',
            'midia_public_id'   => 'nullable|string',
        ]);

        if (isset($validated['midia_public_id']) && $postagem->midia_public_id && $validated['midia_public_id'] !== $postagem->midia_public_id) {
            Log::info("Substituindo mídia. Deletando a antiga: {$postagem->midia_public_id}");
            Storage::disk('cloudinary')->delete($postagem->midia_public_id);
        }

        $this->postagemService->update($postagem, $validated);
        $fresh = Postagem::with('voluntario')->findOrFail($id);

        return response()->json($fresh, 200);
    }

    public function destroy($id)
    {
        $postagem = Postagem::findOrFail($id);

        if ($postagem->midia_public_id) {
            Storage::disk('cloudinary')->delete($postagem->midia_public_id);
            Log::info("Arquivo removido do Cloudinary: {$postagem->midia_public_id}");
        }

        $this->postagemService->delete($postagem);
        return response()->noContent();
    }
}
