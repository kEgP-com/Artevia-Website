<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('suspended_users', function (Blueprint $table) {
            $table->id();
            // Link to the user being banned
            $table->foreignId('user_id')->constrained('users_info')->onDelete('cascade');
            
            // This saves the text the Admin types
            $table->text('reason')->nullable(); 
            
            // This saves "permanent" or "temporary"
            $table->string('type'); 
            
            // This saves the Date (or null if permanent)
            $table->timestamp('banned_until')->nullable();
            
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('suspended_users');
    }
};