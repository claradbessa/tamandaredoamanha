<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Aula extends Model
{
    use HasFactory;

    protected $fillable = [
        'nome',
        'descricao',
        'horario',
        'dia_semana',
        'voluntario_id',
        'capacidade',
        'local_aula',
    ];

    public function voluntario(): BelongsTo
    {
        return $this->belongsTo(Voluntario::class);
    }

    // Define a relação de "Muitos para Muitos" entre Aula e Aluno
    public function alunos(): BelongsToMany
    {
        return $this->belongsToMany(Aluno::class, 'matriculas');
    }
}
