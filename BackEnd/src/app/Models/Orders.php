<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Orders extends Model
{
    use HasFactory;
    protected $table = 'orders';
    protected $fillable = [
        'user_id', 
        'name', 
        'price', 
        'quantity', 
        'image',
        'status', 
        'address', 
        'contact', 
        'payment_method', 
        'total_amount',
        'driver', 
        'rating', 
        'delivery_date'
    ];
}