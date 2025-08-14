<?php

namespace App\Http\Controllers;

use App\Models\GaleriaImagem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class GaleriaController extends Controller
{
    /**
     * Lista todas as imagens da galeria.
     */
    public function index()
    {
        // O accessor 'url' no Model já é chamado automaticamente.
        // Adicionamos orderByDesc para mostrar as mais recentes primeiro.
        return response()->json(GaleriaImagem::orderByDesc('created_at')->get());
    }

    /**
     * Salva novas imagens na galeria.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'imagens' => 'required|array',
            'imagens.*' => 'image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $imagensSalvas = [];

        foreach ($validated['imagens'] as $file) {
            $path = $file->store('galeria', 'public');
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
