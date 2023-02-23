<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\CreditCardController;
use App\Http\Controllers\CreditCardTransactionController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::group([
        'as' => 'credit-cards.',
        'prefix' => '/credit-cards',
    ],function () {

        Route::get('/', [CreditCardController::class, 'index'])->name('index');
        // Route::get('/create', [CreditCardController::class, 'create'])->name('create');
        // Route::post('/create', [CreditCardController::class, 'store']);

        Route::group([
            'prefix' => '/{creditCard}',
        ],function () {

            Route::get('/edit', [CreditCardController::class, 'edit'])->name('edit');
            Route::put('/edit', [CreditCardController::class, 'update']);
            Route::delete('/delete', [CreditCardController::class, 'destroy'])->name('destroy');

            Route::group([
                'as' => 'transactions.',
                'prefix' => '/transactions',
            ],function () {

                Route::get('/', [CreditCardTransactionController::class, 'index'])->name('index');
            });
        });

    });

});

require __DIR__.'/auth.php';
