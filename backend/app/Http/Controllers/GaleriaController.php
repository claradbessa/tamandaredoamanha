<?php

namespace App\Http\Controllers;

use App\Models\GaleriaImagem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class GaleriaController extends Controller
{
    public function index()
    {
        try {
            return response()->json(GaleriaImagem::orderByDesc('created_at')->get());
        } catch (\Throwable $e) {
            Log::error('Erro ao listar galeria', ['msg' => $e->getMessage()]);
            return response()->json(['message' => 'Erro ao listar imagens da galeria.'], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'imagens'   => 'required',
                'imagens.*' => 'image|mimes:jpg,jpeg,png|max:5120', // 5MB
            ]);

            $arquivos = $request->file('imagens');

            if (!$arquivos) {
                Log::warning('Nenhum arquivo recebido em "imagens"');
                return response()->json(['message' => 'Nenhum arquivo recebido.'], 422);
            }
            if (!is_array($arquivos)) {
                $arquivos = [$arquivos];
            }

            Log::info('Upload galeria', ['qtd' => count($arquivos)]);

            $imagensSalvas = [];
            foreach ($arquivos as $imagem) {
                if (!$imagem) {
                    continue;
                }
                $path = $imagem->store('galeria', 'public');
                $imagensSalvas[] = GaleriaImagem::create(['caminho' => $path]);
            }

            return response()->json($imagensSalvas, 201);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Falha de validação.',
                'errors'  => $e->errors(),
            ], 422);
        } catch (\Throwable $e) {
            Log::error('Erro ao salvar imagens na galeria', [
                'msg' => $e->getMessage(),
            ]);
            return response()->json(['message' => 'Erro ao salvar imagens.'], 500);
        }
    }

    public function destroy(GaleriaImagem $galeriaImagem)
    {
        try {
            if ($galeriaImagem->caminho) {
                Storage::disk('public')->delete($galeriaImagem->caminho);
            }
            $galeriaImagem->delete();
            return response()->noContent();
        } catch (\Throwable $e) {
            Log::error('Erro ao excluir da galeria', ['msg' => $e->getMessage()]);
            return response()->json(['message' => 'Erro ao excluir imagem.'], 500);
        }
    }
}
