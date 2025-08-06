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
     * Accessor para obter a URL completa da mídia de forma segura.
     */
    public function getMidiaUrlAttribute(): ?string
    {
        try {
            // Verifica se o campo 'midia' existe e se o ficheiro realmente está no disco
            if ($this->midia && Storage::disk('public')->exists($this->midia)) {
                return Storage::url($this->midia);
            }
            return null;
        } catch (\Throwable $e) {
            // Se houver um erro (ex: APP_URL em falta), regista no log e retorna null
            Log::error('Erro ao gerar URL da mídia para a postagem ID ' . $this->id . ': ' . $e->getMessage());
            return null;
        }
    }
}
