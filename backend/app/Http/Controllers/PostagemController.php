<?php

namespace App\Http\Controllers;

use App\Models\Postagem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PostagemController extends Controller
{
    /**
     * Lista todas as postagens.
     */
    public function index()
    {
        // Uso latest() para ordenar da mais nova para a mais antiga.
        $postagens = Postagem::with('voluntario')->latest()->get();
        return response()->json($postagens);
    }

    /**
     * Cria uma nova postagem.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'titulo' => 'required|string|max:150',
            'conteudo' => 'required|string',
            'midia' => 'nullable|file|mimes:jpg,jpeg,png,gif,mp4|max:20480', // Aceita imagem ou vídeo de até 20MB
            'publicado' => 'sometimes|boolean',
            'voluntario_id' => 'required|exists:voluntarios,id',
            'categoria' => 'nullable|string|max:50',
        ]);

        if ($request->hasFile('midia')) {
            // Salva o arquivo e armazena o caminho
            $path = $request->file('midia')->store('uploads/midia', 'public');
            $validatedData['midia'] = $path;
        }

        $postagem = Postagem::create($validatedData);

        return response()->json($postagem, 201);
    }

    /**
     * Mostra uma postagem específica.
     */
    public function show(Postagem $postagem)
    {
        // Incrementa o contador de visualizações
        $postagem->increment('visualizacoes');
        // Carrega os dados do voluntário autor do post
        $postagem->load('voluntario');
        return response()->json($postagem);
    }

    /**
     * Atualiza uma postagem específica.
     */
    public function update(Request $request, Postagem $postagem)
    {
        $validatedData = $request->validate([
            'titulo' => 'sometimes|required|string|max:150',
            'conteudo' => 'sometimes|required|string',
            'midia' => 'nullable|file|mimes:jpg,jpeg,png,gif,mp4|max:20480',
            'publicado' => 'sometimes|boolean',
            'voluntario_id' => 'sometimes|required|exists:voluntarios,id',
            'categoria' => 'nullable|string|max:50',
        ]);

        if ($request->hasFile('midia')) {
            // Apaga a mídia antiga, se existir
            if ($postagem->midia) {
                Storage::disk('public')->delete($postagem->midia);
            }
            // Salva a nova mídia e atualiza o caminho
            $path = $request->file('midia')->store('uploads/midia', 'public');
            $validatedData['midia'] = $path;
        }

        $postagem->update($validatedData);

        return response()->json($postagem);
    }

    /**
     * Deleta uma postagem.
     */
    public function destroy(Postagem $postagem)
    {
        // Apaga o arquivo de mídia associado, se existir
        if ($postagem->midia) {
            Storage::disk('public')->delete($postagem->midia);
        }

        $postagem->delete();

        return response()->json(null, 204);
    }
}
