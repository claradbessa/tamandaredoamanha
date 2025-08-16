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
            $imagens = GaleriaImagem::all();
            return response()->json($imagens);
        } catch (\Throwable $e) {
            Log::error('Erro no index da Galeria', ['msg' => $e->getMessage()]);
            return response()->json([
                'message' => 'Erro ao listar imagens',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Salva novas imagens na galeria
     */
    public function store(Request $request)
    {
        try {
            if (!$request->hasFile('imagens')) {
                return response()->json([
                    'message' => 'Nenhuma imagem enviada',
                    'debug'   => $request->all()
                ], 400);
            }

            $arquivos = $request->file('imagens');
            if (!is_array($arquivos)) {
                $arquivos = [$arquivos]; 
            }

            $salvas = [];
            foreach ($arquivos as $arquivo) {
                if ($arquivo->isValid()) {
                    $path = $arquivo->store('galeria', 'public');
                    $img = GaleriaImagem::create([
                        'caminho'   => $path,
                        'descricao' => $arquivo->getClientOriginalName(),
                    ]);
                    $salvas[] = $img;
                } else {
                    Log::warning('Arquivo inválido recebido', [
                        'name' => $arquivo->getClientOriginalName()
                    ]);
                }
            }

            return response()->json($salvas, 201);

        } catch (\Throwable $e) {
            Log::error('🔥 Erro no store da Galeria', [
                'msg'   => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Erro ao salvar imagem',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove uma imagem da galeria
     */
    public function destroy(GaleriaImagem $galeriaImagem)
    {
        try {
            // Remove o arquivo físico
            if ($galeriaImagem->caminho && Storage::disk('public')->exists($galeriaImagem->caminho)) {
                Storage::disk('public')->delete($galeriaImagem->caminho);
            }

            $galeriaImagem->delete();

            return response()->json(['message' => 'Imagem excluída com sucesso']);
        } catch (\Throwable $e) {
            Log::error('Erro ao excluir imagem da galeria', [
                'msg' => $e->getMessage()
            ]);
            return response()->json([
                'message' => 'Erro ao excluir imagem',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }
}
