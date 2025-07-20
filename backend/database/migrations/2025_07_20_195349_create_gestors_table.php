<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('gestores', function (Blueprint $table) {
            $table->id();
            $table->string('nome', 100);
            $table->string('email', 100)->unique();
            $table->string('senha', 255);
            $table->enum('nivel_acesso', ['basico', 'medio', 'alto'])->default('medio');
            $table->timestamps(); // Corresponde a data_cadastro
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('gestores');
    }
};
