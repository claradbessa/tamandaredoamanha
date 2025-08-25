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
            'titulo'        => 'required|string|max:150',
            'conteudo'      => 'required|string',
            'midia'         => 'nullable|file|mimes:jpg,jpeg,png,gif,mp4|max:20480',
            'voluntario_id' => 'required|exists:voluntarios,id',
        ]);

        if ($request->hasFile('midia')) {
            $file = $request->file('midia');

            // Upload no Cloudinary
            $path = $file->store('postagens', 'cloudinary');
            $url = Storage::disk('cloudinary')->url($path);

            // Extrai public_id para deletar futuramente
            $publicId = $this->extractPublicId($url);

            $validated['midia_url'] = $url;
            $validated['midia_public_id'] = $publicId;
            Log::info("Arquivo enviado para Cloudinary: {$url}");
        }

        $postagem = $this->postagemService->create($validated);
        $fresh = Postagem::with('voluntario')->findOrFail($postagem->id);

        return response()->json($fresh, 201);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'titulo'        => 'sometimes|string|max:150',
            'conteudo'      => 'sometimes|string',
            'midia'         => 'nullable|file|mimes:jpg,jpeg,png,gif,mp4|max:20480',
            'voluntario_id' => 'sometimes|exists:voluntarios,id',
        ]);

        $postagem = Postagem::findOrFail($id);

        if ($request->hasFile('midia')) {
            if ($postagem->midia_public_id) {
                Storage::disk('cloudinary')->delete($postagem->midia_public_id);
                Log::info("Arquivo antigo removido: {$postagem->midia_public_id}");
            }

            $file = $request->file('midia');
            $path = $file->store('postagens', 'cloudinary');
            $url = Storage::disk('cloudinary')->url($path);
            $publicId = $this->extractPublicId($url);

            $validated['midia_url'] = $url;
            $validated['midia_public_id'] = $publicId;
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

    private function extractPublicId($url)
    {
        // Captura tudo entre o /upload/ e a extensão do arquivo
        preg_match('/\/upload\/(?:v\d+\/)?(.+?)\.[a-zA-Z0-9]+$/', $url, $matches);
        return $matches[1] ?? null;
    }
}
