<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Gestor extends Model
{
    use HasFactory;

    protected $table = 'gestores'; 

    protected $fillable = [
        'nome',
        'email',
        'senha',
        'nivel_acesso',
    ];
}
