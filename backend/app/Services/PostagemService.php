<?php

namespace App\Services;

use App\Models\Postagem;
use Illuminate\Support\Facades\Storage;

class PostagemService
{
    public function getAll()
    {
        return Postagem::with('voluntario')->latest()->get();
    }

    public function create(array $data)
    {
        if (isset($data['midia'])) {
            $path = $data['midia']->store('uploads/midia', 'public');
            $data['midia'] = $path;
        }

        return Postagem::create($data);
    }

    public function update(Postagem $postagem, array $data)
    {
        if (isset($data['midia'])) {
            if ($postagem->midia) {
                Storage::disk('public')->delete($postagem->midia);
            }
            $path = $data['midia']->store('uploads/midia', 'public');
            $data['midia'] = $path;
        }

        $postagem->update($data);
        return $postagem;
    }

    public function delete(Postagem $postagem)
    {
        if ($postagem->midia) {
            Storage::disk('public')->delete($postagem->midia);
        }

        return $postagem->delete();
    }
}
