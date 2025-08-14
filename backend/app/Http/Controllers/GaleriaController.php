<?php

namespace App\Http\Controllers;

use App\Models\GaleriaImagem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

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
     * Armazena uma ou mais imagens novas (modo detetive).
     */
    public function store(Request $request)
    {
        Log::info('🚀 Upload iniciado');

        // Loga headers e método
        Log::info('📩 Request info', [
            'method' => $request->method(),
            'content_type' => $request->header('Content-Type'),
        ]);

        // Verifica se o Laravel está vendo arquivos
        Log::info('📂 hasFile("imagens")?', [
            'hasFile' => $request->hasFile('imagens'),
            'all_files' => $request->allFiles(),
        ]);

        try {
            Log::info('🔍 Validando arquivos...');
            $request->validate([
                'imagens'   => 'required',
                'imagens.*' => 'image|mimes:jpg,jpeg,png|max:5120', // 5 MB
            ]);
            Log::info('✅ Validação OK');
        } catch (ValidationException $e) {
            Log::warning('⚠️ Falha na validação', ['errors' => $e->errors()]);
            return response()->json([
                'message' => 'Falha de validação.',
                'errors'  => $e->errors(),
            ], 422);
        }

        // Recupera arquivos
        $arquivos = $request->file('imagens');
        if (!is_array($arquivos)) {
            $arquivos = [$arquivos];
        }
        Log::info('📦 Arquivos recebidos', ['qtd' => count($arquivos)]);

        $imagensSalvas = [];
        try {
            foreach ($arquivos as $imagem) {
                if (!$imagem) {
                    Log::warning('❌ Arquivo nulo detectado, pulando...');
                    continue;
                }
                $path = $imagem->store('galeria', 'public');
                $imagensSalvas[] = GaleriaImagem::create(['caminho' => $path]);
                Log::info('💾 Arquivo salvo', ['path' => $path]);
            }
        } catch (\Throwable $e) {
            Log::error('🔥 Erro ao salvar arquivo', [
                'msg' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json(['message' => 'Erro ao salvar imagens.'], 500);
        }

        Log::info('🎉 Upload concluído com sucesso', ['total_salvos' => count($imagensSalvas)]);
        return response()->json($imagensSalvas, 201);
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
            return response()->noContent();
        } catch (\Throwable $e) {
            Log::error('Erro ao excluir da galeria', ['msg' => $e->getMessage()]);
            return response()->json(['message' => 'Erro ao excluir imagem.'], 500);
        }
    }
}
