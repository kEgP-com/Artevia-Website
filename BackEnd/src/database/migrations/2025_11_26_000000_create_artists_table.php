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
        Schema::create('artists', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('origin')->nullable(); // ✅ Added
            $table->string('style')->nullable();  // ✅ Added
            $table->string('email')->nullable();  // ✅ Added
            $table->text('bio')->nullable();
            $table->string('profile_image')->nullable();
            $table->timestamps();
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('artists');
    }
};