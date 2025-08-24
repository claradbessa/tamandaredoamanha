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
        Schema::table('postagens', function (Blueprint $table) {
            if (!Schema::hasColumn('postagens', 'midia_public_id')) {
                $table->string('midia_public_id')->nullable()->after('midia_url');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('postagens', function (Blueprint $table) {
            if (Schema::hasColumn('postagens', 'midia_public_id')) {
                $table->dropColumn('midia_public_id');
            }
        });
    }
};
