<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('postagens', function (Blueprint $table) {
            $table->id();
            $table->string('titulo', 150);
            $table->text('conteudo');
            $table->string('midia', 255)->nullable();
            $table->boolean('publicado')->default(false);
            $table->foreignId('voluntario_id')->nullable()->constrained('voluntarios')->onDelete('set null');
            $table->string('categoria', 50)->nullable();
            $table->integer('visualizacoes')->default(0);
            $table->timestamps(); // Cria 'created_at' que funciona como a 'data_publicacao'
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('postagens');
    }
};
