<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class users_info extends Model
{
    protected $table = 'users_info';
    

    protected $fillable = [
        'name', 'email', 'password', 'address', 'contact', 'age', 
        'gcash', 'paypal', 'is_banned' 
    ];

    protected $casts = [
        'is_banned' => 'boolean',
    ];


    public function suspension() {
        return $this->hasOne(SuspendedUser::class, 'user_id');
    }
    
    
   // protected $with = ['suspension']; 
}