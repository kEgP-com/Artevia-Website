<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('users_info', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');
            
            // 👇 Change: Make these nullable so new accounts can be created easily
            $table->string('address')->nullable();
            $table->string('contact')->nullable();
            $table->integer('age')->nullable();
            
            $table->string('gcash')->nullable();
            $table->string('paypal')->nullable();
            
            // 👇 New Feature: Banned Status (default is false/0)
            $table->boolean('is_banned')->default(false); 

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users_info');
    }
};