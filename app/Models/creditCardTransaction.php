<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class creditCardTransaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'credit_card_id',
        'installments_parent_id',
        'description',
        'amount',
        'date_in',
        'date_out',
    ];

    protected $casts = [
        'amount' => 'float',
        'date_in' => 'date',
        'date_out' => 'date',
    ];

    public function creditCard()
    {
        return $this->belongsTo(CreditCard::class);
    }

    public function installmentsParent()
    {
        return $this->belongsTo(CreditCardTransaction::class);
    }

    public function installments()
    {
        return $this->hasMany(CreditCardTransaction::class);
    }

}
