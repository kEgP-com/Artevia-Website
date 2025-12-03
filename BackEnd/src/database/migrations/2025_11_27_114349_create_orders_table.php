<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id'); // Links to User
            
            // Item Details (Snapshot of what they bought)
            $table->string('name');
            $table->decimal('price', 10, 2);
            $table->integer('quantity');
            $table->string('image')->nullable();
            
            // Order Info
            $table->string('status')->default('Pending'); // Pending, Delivered, Cancelled
            $table->string('address');
            $table->string('contact');
            $table->string('payment_method'); // PayPal, GCash, COD
            $table->decimal('total_amount', 10, 2);
            
            // Extra Frontend Fields (Added here so you don't need a 2nd migration)
            $table->string('driver')->nullable();       // e.g. "Juan Dela Cruz"
            $table->integer('rating')->nullable();      // 1-5 Stars
            $table->string('delivery_date')->nullable(); // Expected Date string
            
            $table->timestamps(); // created_at (Order Date), updated_at
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};