<?php

namespace App\Http\Controllers;

use App\Models\creditCard;
use App\Models\creditCardTransaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CreditCardTransactionController extends Controller
{
    public function index(Request $request, creditCard $creditCard)
    {
        //auth
        $loggedUser = $request->user();

        //requested month or the current month (only month)
        $month = $request->input('date_in', now()->format('m'));

        //requested year or the current year (only year)
        $year = $request->input('date_in', now()->format('Y'));

        $transactions = creditCardTransaction::where('credit_card_id', $creditCard->id)
                                                ->where('credit_card_id', $creditCard->id)
                                                //where date_id between the first and last day of the $month
                                                ->whereBetween('date_in', [
                                                    now()->setDate($year, $month, 1)->format('Y-m-d'),
                                                    now()->setDate($year, $month, 1)->endOfMonth()->format('Y-m-d'),
                                                ])
                                                ->orderBy('date_in', 'asc')
                                                ->get();

        //if ajax request, return only json
        if ($request->ajax()) {
            return response()->json([
                'creditCard' => $creditCard,
                'transactions' => $transactions,
            ]);
        }

        //inertia render
        return Inertia::render('CreditCard/Transaction/Index', [
            'creditCard' => $creditCard,
            'transactions' => $transactions,
        ]);
    }
}
