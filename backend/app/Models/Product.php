<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'sku',
        'category_id',
        'price',
        'stock',
        'image',
        'status',
    ];
    // Ek Product ek Category se belong karti hai methord
    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
