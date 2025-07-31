<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Aluno extends Model
{
    use HasFactory;

    protected $fillable = [
        'nome',
        'data_nascimento',
        'nome_responsaveis',
        'telefone',
        'endereco',
        'observacoes',
        'ativo',
    ];

    public function aulas(): BelongsToMany
    {
        return $this->belongsToMany(Aula::class, 'matriculas');
    }
}
