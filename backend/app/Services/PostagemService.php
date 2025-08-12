<?php

namespace App\Services;

use App\Models\Postagem;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class PostagemService
{
    public function getAll()
    {
        return Postagem::with('voluntario')->orderBy('created_at', 'desc')->get();
    }

    public function create(array $data)
    {
        Log::info('[PostagemService] Criando nova postagem.');
        try {
            if (isset($data['midia']) && $data['midia']->isValid()) {
                $path = $data['midia']->store('postagens', 'public');
                $data['midia'] = $path;
            }

            $postagem = Postagem::create($data);
            Log::info("[PostagemService] Postagem criada com ID: {$postagem->id}");

            return $postagem;
        } catch (\Throwable $e) {
            Log::error('[PostagemService] Erro ao criar postagem: ' . $e->getMessage());
            report($e);
            throw $e;
        }
    }

    public function update(Postagem $postagem, array $data)
    {
        Log::info("[PostagemService] Atualizando postagem ID: {$postagem->id}");
        try {
            if (isset($data['midia']) && $data['midia']->isValid()) {
                if ($postagem->midia && Storage::disk('public')->exists($postagem->midia)) {
                    Storage::disk('public')->delete($postagem->midia);
                }

                $path = $data['midia']->store('postagens', 'public');
                $data['midia'] = $path;
            }

            $success = $postagem->update($data);
            Log::info("[PostagemService] Postagem ID {$postagem->id} atualizada. Sucesso na BD: " . ($success ? 'Sim' : 'Não'));

            return $postagem;
        } catch (\Throwable $e) {
            Log::error('[PostagemService] Erro ao atualizar postagem: ' . $e->getMessage());
            report($e);
            throw $e;
        }
    }

    public function delete(Postagem $postagem)
    {
        Log::info("[PostagemService] Deletando postagem ID: {$postagem->id}");
        try {
            if ($postagem->midia && Storage::disk('public')->exists($postagem->midia)) {
                Storage::disk('public')->delete($postagem->midia);
            }

            $success = $postagem->delete();
            Log::info("[PostagemService] Postagem ID {$postagem->id} excluída. Sucesso na BD: " . ($success ? 'Sim' : 'Não'));

            return $success; 
        } catch (\Throwable $e) {
            Log::error('[PostagemService] Erro ao deletar postagem: ' . $e->getMessage());
            report($e);
            throw $e;
        }
    }
}
