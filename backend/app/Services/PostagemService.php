<?php

namespace App\Services;

use App\Models\Postagem;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class PostagemService
{
    public function getAll()
    {
        return Postagem::with('voluntario')->latest()->get();
    }

    public function create(array $data)
    {
        try {
            Log::info('[PostagemService] A iniciar a criação da postagem.');

            if (isset($data['midia']) && $data['midia']->isValid()) {
                Log::info('[PostagemService] Arquivo de mídia é válido. A tentar salvar...');
                $path = $data['midia']->store('uploads/midia', 'public');
                Log::info('[PostagemService] Arquivo salvo com sucesso em: ' . $path);
                $data['midia'] = $path;
            }

            $postagem = Postagem::create($data);
            Log::info('[PostagemService] Postagem criada no banco de dados com ID: ' . $postagem->id);
            return $postagem;

        } catch (\Throwable $e) {
            Log::error('[PostagemService] ERRO na criação: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            throw $e;
        }
    }

    public function update(Postagem $postagem, array $data)
    {
        if (isset($data['midia']) && $data['midia']->isValid()) {
            if ($postagem->midia) {
                Storage::delete($postagem->midia);
            }
            $path = $data['midia']->store('uploads/midia');
            $data['midia'] = $path;
        }

        $postagem->update($data);
        return $postagem;
    }

    public function delete(Postagem $postagem)
    {
        if ($postagem->midia) {
            Storage::delete($postagem->midia);
        }

        return $postagem->delete();
    }
}
