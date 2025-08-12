<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class Postagem extends Model
{
    use HasFactory;

    protected $table = 'postagens';

    protected $fillable = [
        'titulo',
        'conteudo',
        'midia',
        'publicado',
        'voluntario_id',
        'categoria',
    ];

    protected $appends = ['midia_url'];

    public function voluntario(): BelongsTo
    {
        return $this->belongsTo(Voluntario::class);
    }

    /**
     * Accessor para obter a URL completa da mídia.
     */
    public function getMidiaUrlAttribute(): ?string
    {
        try {
            if ($this->midia && Storage::disk('public')->exists($this->midia)) {
                return Storage::disk('public')->url($this->midia);
            }
            // Retorna placeholder caso não tenha mídia
            return asset('images/placeholder.jpg');
        } catch (\Throwable $e) {
            Log::error("Erro ao gerar URL da mídia para a postagem ID {$this->id}: {$e->getMessage()}");
            return asset('images/placeholder.jpg');
        }
    }
}
