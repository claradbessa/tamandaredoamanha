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
        'midia',
        'publicado',
        'voluntario_id',
        'categoria',
    ];

    public function voluntario(): BelongsTo
    {
        return $this->belongsTo(Voluntario::class);
    }
}
