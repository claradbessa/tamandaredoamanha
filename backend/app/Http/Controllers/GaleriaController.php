<?php

namespace App\Http\Controllers;

use App\Models\GaleriaImagem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class GaleriaController extends Controller
{
    /**
     * Exibe todas as imagens da galeria.
     */
    public function index()
    {
        // Retorna as imagens mais recentes primeiro. O accessor 'url' no Model já é chamado automaticamente.
        return response()->json(GaleriaImagem::orderByDesc('created_at')->get());
    }

    /**
     * Armazena uma ou mais imagens novas.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'imagens' => 'required|array',
            'imagens.*' => 'image|mimes:jpg,jpeg,png|max:2048', // Limite de 2MB por imagem
        ]);

        $imagensSalvas = [];

        foreach ($validated['imagens'] as $imagem) {
            $path = $imagem->store('galeria', 'public');
            $imagensSalvas[] = GaleriaImagem::create(['caminho' => $path]);
        }

        return response()->json($imagensSalvas, 201);
    }

    /**
     * Remove uma imagem da galeria.
     */
    public function destroy(GaleriaImagem $galeriaImagem)
    {
        // O Route-Model Binding já encontra a imagem para nós.
        if ($galeriaImagem->caminho) {
            Storage::disk('public')->delete($galeriaImagem->caminho);
        }
        $galeriaImagem->delete();

        // Retorna a resposta padrão para uma exclusão bem-sucedida.
        return response()->noContent();
    }
}
