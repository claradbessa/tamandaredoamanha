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
        Log::info('[PostagemService] Iniciando criação de postagem.');

        try {
            if (isset($data['midia']) && $data['midia']->isValid()) {
                Log::info('[PostagemService] Salvando mídia.');

                // $path = $data['midia']->store('postagens', 'public');
                // $data['midia_url'] = Storage::url($path);

                // unset($data['midia']);

                $path = $data['midia']->store('uploads/midia', 'public');
                $data['midia'] = $path;
            } else {
                Log::warning('[PostagemService] Nenhuma mídia válida enviada.');
            }

            $postagem = Postagem::create($data);

            Log::info('[PostagemService] Postagem criada com ID: ' . $postagem->id);

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
                Log::info('[PostagemService] Substituindo mídia.');

                // Apagar mídia antiga, se existir
                if ($postagem->midia_url) {
                    $oldPath = str_replace('/storage/', '', $postagem->midia_url);
                    Storage::disk('public')->delete($oldPath);
                }

                $path = $data['midia']->store('postagens', 'public');
                $data['midia_url'] = Storage::url($path);

                unset($data['midia']);
            }

            $postagem->update($data);

            Log::info("[PostagemService] Postagem ID {$postagem->id} atualizada com sucesso.");

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
            if ($postagem->midia_url) {
                $path = str_replace('/storage/', '', $postagem->midia_url);
                Storage::disk('public')->delete($path);
            }

            $postagem->delete();

            Log::info("[PostagemService] Postagem ID {$postagem->id} deletada.");
        } catch (\Throwable $e) {
            Log::error('[PostagemService] Erro ao deletar postagem: ' . $e->getMessage());
            report($e);
            throw $e;
        }
    }
}
