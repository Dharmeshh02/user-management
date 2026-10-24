<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'phone',
        'address',
        'city',
        'state',
        'country',
        'pincode',
        'payment_method',
        'subtotal',
        'shipping',
        'grand_total',
        'status',
    ];
    // Order belongs to a User 
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    // Order belongs to a orderItems
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
}
