<?php

namespace App\Http\Controllers;

use App\Models\GaleriaImagem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class GaleriaController extends Controller
{
    public function index()
    {
        $imagens = GaleriaImagem::orderByDesc('created_at')->get();
        return response()->json($imagens);
    }

    public function store(Request $request)
    {
        $request->validate([
            'imagens'             => 'required|array',
            'imagens.*.caminho'   => 'required|url',
            'imagens.*.public_id' => 'required|string',
            'imagens.*.descricao' => 'nullable|string',
        ]);

        $salvas = [];
        $imagensData = $request->input('imagens');

        foreach ($imagensData as $imageData) {
            $img = GaleriaImagem::create([
                'caminho'   => $imageData['caminho'],
                'public_id' => $imageData['public_id'],
                'descricao' => $imageData['descricao'] ?? 'Imagem da galeria',
            ]);
            Log::info("Imagem da Cloudinary registrada no banco: {$imageData['caminho']}");
            $salvas[] = $img;
        }

        return response()->json($salvas, 201);
    }

    public function destroy(GaleriaImagem $galeriaImagem)
    {
        if ($galeriaImagem->public_id) {
            Storage::disk('cloudinary')->delete($galeriaImagem->public_id);
            Log::info("Imagem removida da Cloudinary: {$galeriaImagem->public_id}");
        }

        $galeriaImagem->delete();
        return response()->json(['message' => 'Imagem excluída com sucesso']);
    }
}
