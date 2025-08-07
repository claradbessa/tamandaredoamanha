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
            if (isset($data['midia']) && $data['midia']->isValid()) {
                $path = $data['midia']->store('uploads/midia', 'public');
                $data['midia'] = $path;
            }
            return Postagem::create($data);
        } catch (\Throwable $e) {
            Log::error('Erro ao criar postagem: ' . $e->getMessage());
            throw $e;
        }
    }

    public function update(Postagem $postagem, array $data)
    {
        try {
            if (isset($data['midia']) && $data['midia']->isValid()) {
                if ($postagem->midia) {
                    Storage::disk('public')->delete($postagem->midia);
                }
                $path = $data['midia']->store('uploads/midia', 'public');
                $data['midia'] = $path;
            }
            $postagem->update($data);
            return $postagem;
        } catch (\Throwable $e) {
            Log::error('Erro ao atualizar postagem ID ' . $postagem->id . ': ' . $e->getMessage());
            throw $e;
        }
    }

    public function delete(Postagem $postagem)
    {
        if ($postagem->midia) {
            Storage::disk('public')->delete($postagem->midia);
        }
        return $postagem->delete();
    }
}
