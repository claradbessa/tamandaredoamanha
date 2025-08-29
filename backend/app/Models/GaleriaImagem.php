<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GaleriaImagem extends Model
{
    use HasFactory;

    protected $table = 'galeria_imagems';

    protected $fillable = [
        'caminho',
        'descricao',
        'public_id', 
    ];
}
