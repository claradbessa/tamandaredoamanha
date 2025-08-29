<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Postagem extends Model
{
    use HasFactory;

    protected $table = 'postagens';

    protected $fillable = [
        'titulo',
        'conteudo',
        'publicado',
        'voluntario_id',
        'categoria',
        'midia_url',
        'midia_public_id',
    ];

    public function voluntario(): BelongsTo
    {
        return $this->belongsTo(Voluntario::class);
    }

    public function getMidiaUrlAttribute(): ?string
    {
        return $this->attributes['midia_url'] ?? null;
    }
}
