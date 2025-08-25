<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('galeria_imagems', function (Blueprint $table) {
            if (!Schema::hasColumn('galeria_imagems', 'public_id')) {
                $table->string('public_id')->nullable()->after('caminho');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('galeria_imagems', function (Blueprint $table) {
            if (Schema::hasColumn('galeria_imagems', 'public_id')) {
                $table->dropColumn('public_id');
            }
        });
    }
};
