<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class creditCard extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'limit',
        'closing_day',
        'payment_day',
    ];

    protected $casts = [
        'limit' => 'float',
        'closing_day' => 'integer',
        'payment_day' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function transactions()
    {
        return $this->hasMany(creditCardTransaction::class);
    }
}
