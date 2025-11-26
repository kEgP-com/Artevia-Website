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
                Schema::create('orders', function (Blueprint $table) {
                    $table->id();
                    // Link to the user who made the order
                    $table->foreignId('user_id')->constrained()->onDelete('cascade'); 
                    
                    $table->decimal('total_price', 10, 2);
                    $table->string('status')->default('pending'); // pending, completed, cancelled
                    $table->string('payment_method')->default('cod'); // cod, gcash, paypal
                    $table->timestamps();
                });
            }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
