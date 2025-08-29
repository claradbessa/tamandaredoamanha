<?php

namespace App\Services;

use App\Models\Postagem;
use Illuminate\Support\Facades\Log;

class PostagemService
{
    public function create(array $data)
    {
        Log::info('[PostagemService] Criando postagem com dados pré-processados.');
        $postagem = Postagem::create($data);
        Log::info('[PostagemService] Postagem criada com ID: ' . $postagem->id);
        return $postagem;
    }

    public function update(Postagem $postagem, array $data)
    {
        Log::info("[PostagemService] Atualizando postagem ID: {$postagem->id}");
        $postagem->update($data);
        Log::info("[PostagemService] Postagem ID {$postagem->id} atualizada com sucesso.");
        return $postagem;
    }

    public function delete(Postagem $postagem)
    {
        Log::info("[PostagemService] Deletando postagem ID: {$postagem->id}");
        $postagem->delete();
        Log::info("[PostagemService] Postagem ID {$postagem->id} deletada.");
    }
}
