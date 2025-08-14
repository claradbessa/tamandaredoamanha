<?php

namespace App\Http\Controllers;

use App\Models\GaleriaImagem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class GaleriaController extends Controller
{
    /**
     * Lista todas as imagens da galeria.
     */
    public function index()
    {
        try {
            return response()->json(GaleriaImagem::orderByDesc('created_at')->get());
        } catch (\Throwable $e) {
            Log::error('Erro ao listar galeria', ['msg' => $e->getMessage()]);
            return response()->json(['message' => 'Erro ao listar imagens da galeria.'], 500);
        }
    }

    /**
     * Armazena uma ou mais imagens novas.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'imagens'   => 'required|array',
                'imagens.*' => 'required|image|mimes:jpg,jpeg,png|max:2048',
            ]);

            $imagensSalvas = [];
            foreach ($validated['imagens'] as $imagem) {
                $path = $imagem->store('galeria', 'public');
                $imagensSalvas[] = GaleriaImagem::create(['caminho' => $path]);
            }

            // Retorna a lista dos objetos de imagem criados, que é o padrão RESTful.
            return response()->json($imagensSalvas, 201);

        } catch (\Exception $e) {
            Log::error('Erro ao salvar imagens na galeria: ' . $e->getMessage());
            return response()->json(['message' => 'Erro ao salvar imagens.'], 500);
        }
    }

    /**
     * Remove uma imagem da galeria.
     */
    public function destroy(GaleriaImagem $galeriaImagem)
    {
        try {
            if ($galeriaImagem->caminho) {
                Storage::disk('public')->delete($galeriaImagem->caminho);
            }
            $galeriaImagem->delete();
            // Retorna a resposta padrão para uma exclusão bem-sucedida.
            return response()->noContent();
        } catch (\Throwable $e) {
            Log::error('Erro ao excluir da galeria', ['msg' => $e->getMessage()]);
            return response()->json(['message' => 'Erro ao excluir imagem.'], 500);
        }
    }
}
