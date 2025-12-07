<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SuspendedUser extends Model
{
    // Make sure 'type' is included here
    protected $table = 'suspended_users';
    protected $fillable = ['user_id', 'reason', 'type', 'banned_until'];
    
    public function user() {
        return $this->belongsTo(users_info::class, 'user_id');
    }
}