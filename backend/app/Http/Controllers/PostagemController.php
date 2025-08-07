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

        Log::info('[PostagemController] A iniciar o método store.');

        if ($request->hasFile('midia')) {
            Log::info('[PostagemController] Arquivo de mídia presente na requisição.');
        } else {
            Log::warning('[PostagemController] Nenhum arquivo de mídia na requisição.');
        }

        $validatedData = $request->validate([
            'titulo' => 'required|string|max:150',
            'conteudo' => 'required|string',
            'midia' => 'nullable|file|mimes:jpg,jpeg,png,gif,mp4|max:20480',
            'publicado' => 'sometimes|boolean',
            'voluntario_id' => 'required|exists:voluntarios,id',
            'categoria' => 'nullable|string|max:50',
        ]);

        Log::info('[PostagemController] Validação concluída com sucesso.');

        $postagem = $this->postagemService->create($validatedData);

        // Carrega o relacionamento com o voluntário antes de retornar
        $postagem->load('voluntario');

        return response()->json($postagem, 201);
    }

    public function show(Postagem $postagem)
    {
        $postagem->increment('visualizacoes');
        $postagem->load('voluntario');
        return response()->json($postagem);
    }

    public function update(Request $request, Postagem $postagem)
    {

        Log::info('Requisição recebida no PostagemController@update para o post ID: ' . $postagem->id);

        $validatedData = $request->validate([
            'titulo' => 'sometimes|required|string|max:150',
            'conteudo' => 'sometimes|required|string',
            'midia' => 'nullable|file|mimes:jpg,jpeg,png,gif,mp4|max:20480',
            'publicado' => 'sometimes|boolean',
            'voluntario_id' => 'sometimes|required|exists:voluntarios,id',
            'categoria' => 'nullable|string|max:50',
        ]);

        Log::info('Validação de update concluída com sucesso.');

        $updatedPostagem = $this->postagemService->update($postagem, $validatedData);

        // Carrega o relacionamento com o voluntário antes de retornar
        $updatedPostagem->load('voluntario');

        return response()->json($updatedPostagem);
    }

    public function destroy(Postagem $postagem)
    {
        $this->postagemService->delete($postagem);

        return response()->json(null, 204);
    }
}
