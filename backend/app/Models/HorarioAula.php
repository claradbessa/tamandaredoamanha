<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HorarioAula extends Model
{
    use HasFactory;

    protected $table = 'horarios_aulas';

    protected $fillable = [
        'aula_id',
        'dia_semana',
        'horario',
    ];
}
