<?php

namespace App\Http\Controllers;

use App\Models\Postagem;
use App\Services\PostagemService;
use Illuminate\Http\Request;
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
            // FORÇA o upload no disco 'cloudinary'
            $path = $request->file('midia')->store('postagens', 'cloudinary');
            // GERA a URL a partir do disco 'cloudinary'
            $validated['midia_url'] = Storage::disk('cloudinary')->url($path);
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
            if ($postagem->midia_url) {
                $publicId = $this->extractPublicId($postagem->midia_url);
                Storage::disk('cloudinary')->delete($publicId);
            }
            $path = $request->file('midia')->store('postagens', 'cloudinary');
            $validated['midia_url'] = Storage::disk('cloudinary')->url($path);
        }

        $this->postagemService->update($postagem, $validated);
        $fresh = Postagem::with('voluntario')->findOrFail($id);
        return response()->json($fresh, 200);
    }

    public function destroy($id)
    {
        $postagem = Postagem::findOrFail($id);
        if ($postagem->midia_url) {
            $publicId = $this->extractPublicId($postagem->midia_url);
            Storage::disk('cloudinary')->delete($publicId);
        }
        $this->postagemService->delete($postagem);
        return response()->noContent();
    }

    private function extractPublicId($url)
    {
        preg_match('/\/v\d+\/(.+?)\./', $url, $matches);
        return $matches[1] ?? null;
    }
}
