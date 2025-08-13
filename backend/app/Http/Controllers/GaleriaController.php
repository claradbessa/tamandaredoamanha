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
        return response()->json(GaleriaImagem::orderBy('created_at', 'desc')->get());
    }

    /**
     * Armazena uma ou mais imagens novas.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'imagens' => 'required|array',
            'imagens.*' => 'image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $imagensSalvas = [];

        foreach ($validated['imagens'] as $imagem) {
            $path = $imagem->store('galeria', 'public');
            $imagensSalvas[] = GaleriaImagem::create(['caminho' => $path]);
        }

        return response()->json($imagensSalvas, 201);
    }

    /**
     * Remove uma imagem específica.
     */
    public function destroy(GaleriaImagem $galeriaImagem)
    {
        if ($galeriaImagem->caminho) {
            Storage::disk('public')->delete($galeriaImagem->caminho);
        }
        $galeriaImagem->delete();

        return response()->noContent();
    }
}
