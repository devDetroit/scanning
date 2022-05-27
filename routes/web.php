<?php

use App\Http\Controllers\ScanningController;
use Illuminate\Support\Facades\Route;

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

Route::middleware('auth')->group(
    function () {
        Route::get('/report', function () {
            abort_if(!Auth::user()->is_admin, 403);
            return view('report');
        });

        Route::get('/dashboard', function () {
            return view('dashboard');
        });

        Route::get('/show', [ScanningController::class, 'getStationData']);
        Route::get('/home', [ScanningController::class, 'index'])->name('home');
        Route::get('/', [ScanningController::class, 'index'])->name('home');
        Route::post('/home', [ScanningController::class, 'store']);
    }
);

Auth::routes();
