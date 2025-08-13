<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class GaleriaImagem extends Model
{
    use HasFactory;

    protected $table = 'galeria_imagens';

    protected $fillable = [
        'caminho',
        'titulo',
    ];

    protected $appends = ['url'];

    public function getUrlAttribute(): ?string
    {
        if ($this->caminho && Storage::disk('public')->exists($this->caminho)) {
            return Storage::disk('public')->url($this->caminho);
        }
        return null;
    }
}
