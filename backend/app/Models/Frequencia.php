<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Frequencia extends Model
{
    use HasFactory;

    protected $table = 'frequencias';

    protected $fillable = [
        'aluno_id',
        'aula_id',
        'data',
        'presenca',
        'observacoes',
        'registrado_por',
    ];

    public function aluno(): BelongsTo
    {
        return $this->belongsTo(Aluno::class);
    }

    public function aula(): BelongsTo
    {
        return $this->belongsTo(Aula::class);
    }

    public function voluntario(): BelongsTo
    {
        return $this->belongsTo(Voluntario::class, 'registrado_por');
    }
}
