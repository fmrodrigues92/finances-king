<?php

namespace App\Http\Controllers;

use App\Models\creditCard;
use App\Models\creditCardTransaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CreditCardTransactionController extends Controller
{
    private function sumFurtherInstallments($transaction)
    {
        $sum = 0;
        foreach ($transaction->installments as $installment) {
            $sum += $installment->amount;
            if ($installment->installments->count() > 0) {
                $sum += $this->sumFurtherInstallments($installment);
            }
        }
        return $sum;
    }

    public function index(Request $request, creditCard $creditCard)
    {
        //auth
        $loggedUser = $request->user();

        //requested month or the current month (only month)
        $month = $request->input('month', now()->format('m'));

        //requested year or the current year (only year)
        $year = $request->input('year', now()->format('Y'));


        //Listagem das transações do cartão de crédito na tabela
        $transactions = creditCardTransaction::where('credit_card_id', $creditCard->id)
                                                ->whereBetween('date_in', [
                                                    now()->setDate($year, $month, 1)->format('Y-m-d'),
                                                    now()->setDate($year, $month, 1)->endOfMonth()->format('Y-m-d'),
                                                ])
                                                ->with('installments')
                                                ->orderBy('date_in', 'asc')
                                                ->get();

        //=======================================================================
        //=======================================================================
        //=======================================================================

        //array with all days in month
        $days = array();
        for ($i = 1; $i <= cal_days_in_month(CAL_GREGORIAN, $month, $year); $i++) {
            $days[] = $i;
        }

        //get all transactions where date_in started in the $month and $year first day of mounth group by day and sum amount
        $transactionsLimit = CreditCardTransaction::where('credit_card_id', $creditCard->id)
            ->where('date_in', '>=', date('Y-m-d', strtotime($year . '-' . $month . '-01')))
            ->where('date_in', '<=', date('Y-m-d', strtotime($year . '-' . $month . '-' . cal_days_in_month(CAL_GREGORIAN, $month, $year))))
            ->with('installments')
            ->orderBy('date_in', 'ASC')
            ->get();

        //montar array com todos os dias do mes e somar os valores de $transactionsLimit do dia pra frente
        $limitUse = array();
        foreach ($days as $i => $day) {
            $limitUse[$day] = $limitUse[$day-1] ?? 0;

            foreach ($transactions as $transaction) {
                //add when date_in
                if (date('d', strtotime($transaction->date_in)) == $day) {
                    $limitUse[$day] += $transaction->amount;
                    if ($transaction->installments->count() > 0) {
                        $limitUse[$day] += $this->sumFurtherInstallments($transaction);
                    }
                }

                //remove when date_out
                if ($transaction->date_out && date('d', strtotime($transaction->date_out)) == $day) {
                    $limitUse[$day] -= $transaction->amount;
                    if ($transaction->installments->count() > 0) {
                        $limitUse[$day] -= $this->sumFurtherInstallments($transaction);
                    }
                }
            }
        }

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
            'limitUse' => $limitUse,
        ]);
    }
}
