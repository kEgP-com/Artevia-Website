<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class users_info extends Model
{
    protected $table = 'users_info';
    
    // Make sure 'is_banned' is still fillable for quick checks
    protected $fillable = [
        'name', 'email', 'password', 'address', 'contact', 'age', 
        'gcash', 'paypal', 'is_banned' 
    ];

    protected $casts = [
        'is_banned' => 'boolean',
    ];

    // Relationship to the suspension details
    public function suspension() {
        return $this->hasOne(SuspendedUser::class, 'user_id');
    }
    
    // Add this so the JSON response includes the suspension details automatically
    protected $with = ['suspension']; 
}