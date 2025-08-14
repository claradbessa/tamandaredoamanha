<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class GaleriaImagem extends Model
{
    use HasFactory;

    protected $table = 'galeria_imagems';

    protected $fillable = [
        'caminho',
        'descricao',
    ];

    protected $appends = ['url'];

    public function getUrlAttribute(): ?string
    {
        $caminho = $this->attributes['caminho'] ?? null;
        if (!$caminho) {
            return null;
        }

        try {
            if (Storage::disk('public')->exists($caminho)) {
                return Storage::url($caminho);
            }
            return null;
        } catch (\Throwable $e) {
            return null;
        }
    }
}
