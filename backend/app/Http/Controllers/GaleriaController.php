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
            'imagens'   => 'required|array',
            'imagens.*' => 'image|mimes:jpg,jpeg,png,gif|max:20480'
        ]);

        $arquivos = $request->file('imagens');
        $salvas = [];

        foreach ($arquivos as $arquivo) {
            if ($arquivo->isValid()) {
                $path = $arquivo->store('galeria', 'cloudinary');
                $url = Storage::disk('cloudinary')->url($path);
                $publicId = $this->extractPublicId($url);

                $img = GaleriaImagem::create([
                    'caminho'        => $url,
                    'descricao'      => $arquivo->getClientOriginalName(),
                    'public_id'      => $publicId, 
                ]);

                Log::info("Imagem enviada: {$url}");
                $salvas[] = $img;
            }
        }

        return response()->json($salvas, 201);
    }

    public function destroy(GaleriaImagem $galeriaImagem)
    {
        if ($galeriaImagem->public_id) {
            Storage::disk('cloudinary')->delete($galeriaImagem->public_id);
            Log::info("Imagem removida: {$galeriaImagem->public_id}");
        }

        $galeriaImagem->delete();
        return response()->json(['message' => 'Imagem excluída com sucesso']);
    }

    private function extractPublicId($url)
    {
        preg_match('/\/upload\/(?:v\d+\/)?(.+?)\.[a-zA-Z0-9]+$/', $url, $matches);
        return $matches[1] ?? null;
    }
}
