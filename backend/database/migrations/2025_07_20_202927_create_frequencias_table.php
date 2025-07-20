<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('frequencias', function (Blueprint $table) {
            $table->id();
            $table->foreignId('aluno_id')->constrained('alunos')->onDelete('cascade');
            $table->foreignId('aula_id')->constrained('aulas')->onDelete('cascade');
            $table->date('data');
            $table->boolean('presenca')->default(false);
            $table->text('observacoes')->nullable();
            $table->foreignId('registrado_por')->nullable()->constrained('voluntarios')->onDelete('set null');
            $table->timestamps(); // Corresponde a data_registro

            // Garante que não haja registros duplicados para o mesmo aluno, na mesma aula, no mesmo dia
            $table->unique(['aluno_id', 'aula_id', 'data']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('frequencias');
    }
};
