<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class users_info extends Model
{
    protected $table = 'users_info';
    protected $fillable = [
    'name',
    'email',
    'password',
    'address',
    'contact',
    'age',
    'gcash',
    'paypal',
];
}