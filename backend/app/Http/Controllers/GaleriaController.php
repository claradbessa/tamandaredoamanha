<?php

namespace App\Http\Controllers;

use App\Models\GaleriaImagem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

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
                // FORÇA o upload no disco 'cloudinary'
                $path = $arquivo->store('galeria', 'cloudinary');
                $url = Storage::disk('cloudinary')->url($path);

                $img = GaleriaImagem::create([
                    'caminho'   => $url,
                    'descricao' => $arquivo->getClientOriginalName(),
                ]);
                $salvas[] = $img;
            }
        }
        return response()->json($salvas, 201);
    }

    public function destroy(GaleriaImagem $galeriaImagem)
    {
        if ($galeriaImagem->caminho) {
            $publicId = $this->extractPublicId($galeriaImagem->caminho);
            Storage::disk('cloudinary')->delete($publicId);
        }
        $galeriaImagem->delete();
        return response()->json(['message' => 'Imagem excluída com sucesso']);
    }

    private function extractPublicId($url)
    {
        preg_match('/\/v\d+\/(.+?)\./', $url, $matches);
        return $matches[1] ?? null;
    }
}
