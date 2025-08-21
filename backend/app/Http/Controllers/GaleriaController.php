<?php

namespace App\Http\Controllers;

use App\Models\GaleriaImagem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class GaleriaController extends Controller
{
    /**
     * Lista todas as imagens da galeria
     */
    public function index()
    {
        try {
            $imagens = GaleriaImagem::orderByDesc('created_at')->get();

            return response()->json($imagens);

        } catch (\Throwable $e) {
            Log::error('Erro no index da Galeria', ['msg' => $e->getMessage()]);
            return response()->json(['message' => 'Erro ao listar imagens'], 500);
        }
    }

    /**
     * Salva novas imagens na galeria
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'imagens' => 'required|array',
                'imagens.*' => 'image|mimes:jpg,jpeg,png,gif|max:20480' // Valida cada imagem no array
            ]);

            $arquivos = $request->file('imagens');
            $salvas = [];

            foreach ($arquivos as $arquivo) {
                if ($arquivo->isValid()) {
                    // 1. FAZ O UPLOAD PARA O CLOUDINARY
                    $path = $arquivo->store('galeria');

                    // 2. OBTÉM A URL COMPLETA
                    $url = Storage::url($path);

                    // 3. SALVA A URL NO BANCO DE DADOS
                    $img = GaleriaImagem::create([
                        'caminho'   => $url,
                        'descricao' => $arquivo->getClientOriginalName(),
                    ]);

                    $salvas[] = $img;
                }
            }

            return response()->json($salvas, 201);

        } catch (\Throwable $e) {
            Log::error('🔥 Erro no store da Galeria', ['msg' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return response()->json(['message' => 'Erro ao salvar as imagens.'], 500);
        }
    }

    /**
     * Remove uma imagem da galeria
     */
    public function destroy(GaleriaImagem $galeriaImagem)
    {
        try {
            // 1. DELETA A IMAGEM DO CLOUDINARY
            if ($galeriaImagem->caminho) {
                Storage::delete($galeriaImagem->caminho);
            }

            // 2. DELETA O REGISTRO DO BANCO DE DADOS
            $galeriaImagem->delete();

            return response()->json(['message' => 'Imagem excluída com sucesso']);

        } catch (\Throwable $e) {
            Log::error('Erro ao excluir imagem da galeria', ['msg' => $e->getMessage()]);
            return response()->json(['message' => 'Erro ao excluir imagem'], 500);
        }
    }
}
