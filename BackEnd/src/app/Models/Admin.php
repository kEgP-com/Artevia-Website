<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Admin extends Model
{
    use HasFactory;

    protected $table = 'admins';
    protected $fillable = ['username', 'email', 'password', 'pin'];
    
    // Hide password/pin when returning data
    protected $hidden = ['password', 'pin']; 
}