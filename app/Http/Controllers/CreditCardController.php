<?php

namespace App\Http\Controllers;

use App\Models\creditCard;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CreditCardController extends Controller
{
    public function index(Request $request)
    {
        //auth
        $loggedUser = $request->user();
        $credit_cards = creditCard::where('user_id', $loggedUser->id)->get();

        //inertia render
        return Inertia::render('CreditCard/Index', [
            'credit_cards' => $credit_cards,
        ]);
    }
}
