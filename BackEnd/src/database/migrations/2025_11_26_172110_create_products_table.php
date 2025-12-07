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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            // Link to the 'artists' table
            $table->foreignId('artist_id')->constrained('artists')->onDelete('cascade');     
            $table->string('name');   
            $table->string('artist');
            $table->string('category');
            $table->decimal('price', 10, 2); // Supports prices like 2750.00
            $table->text('description');
            $table->string('image_url')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};