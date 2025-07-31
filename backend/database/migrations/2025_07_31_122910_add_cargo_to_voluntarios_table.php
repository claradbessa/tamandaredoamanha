<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Executa as migrações.
     */
    public function up(): void
    {
        Schema::table('voluntarios', function (Blueprint $table) {
            // Adiciona a nova coluna 'cargo' após a coluna 'senha'
            $table->string('cargo', 100)->nullable()->after('senha');
        });
    }

    /**
     * Reverte as migrações.
     */
    public function down(): void
    {
        Schema::table('voluntarios', function (Blueprint $table) {
            // Remove a coluna 'cargo' se a migração for revertida
            $table->dropColumn('cargo');
        });
    }
};
