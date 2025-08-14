<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class GaleriaImagem extends Model
{
    use HasFactory;

    protected $table = 'galeria_imagens';

    /**
     * Campos que podem ser preenchidos em massa
     */
    protected $fillable = [
        'caminho',
        'titulo',
    ];

    /**
     * Atributos que serão automaticamente adicionados ao JSON
     */
    protected $appends = ['url'];

    /**
     * Acessor para gerar a URL pública da imagem
     */
    public function getUrlAttribute()
    {
        // Gera a URL baseada no caminho armazenado no banco
        return $this->caminho ? Storage::url($this->caminho) : null;
    }
}
