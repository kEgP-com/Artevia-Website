<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contact_messages', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->string('subject');
            $table->text('message');
            $table->string('status')->default('Unread'); // Unread, Resolved
            $table->text('response')->nullable();        // Admin's reply
            $table->timestamps(); // created_at serves as the 'Date'
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contact_messages');
    }
};