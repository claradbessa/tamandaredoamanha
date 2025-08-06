<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class Postagem extends Model
{
    use HasFactory;

    protected $fillable = [
        'titulo',
        'conteudo',
        'midia',
        'publicado',
        'voluntario_id',
        'categoria',
    ];

    // Adiciona a nova propriedade 'midia_url' à resposta JSON
    protected $appends = ['midia_url'];

    public function voluntario(): BelongsTo
    {
        return $this->belongsTo(Voluntario::class);
    }

    // Adiciona a nova função "Accessor"
    public function getMidiaUrlAttribute(): ?string
    {
        if ($this->midia) {
            return Storage::url($this->midia);
        }
        return null;
    }
}
