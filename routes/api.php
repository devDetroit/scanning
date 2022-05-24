<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Station;
use Illuminate\Support\Facades\DB;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


Route::get('/stations', function () {
    return Station::all();
});

Route::get('/report/filter', function () {
    $currentDate =  date("Y-m-d");
    $filter = [];

    array_push($filter, ['scannings.created_at', '>=', isset(request()->fromDate) ? request()->fromDate . " 00:00:01" : "$currentDate 00:00:01"]);
    array_push($filter, ['scannings.created_at', '<=', isset(request()->toDate) ? request()->toDate . " 23:59:59" : "$currentDate 23:59:59"]);

    if (isset(request()->station_id)) {
        if (request()->station_id != "All")
            array_push($filter, ['scannings.station_id', request()->station_id]);
    }

    return DB::table('scannings')
        ->join('users', 'scannings.user_id', '=', 'users.id')
        ->join('stations', 'scannings.station_id', '=', 'stations.id')
        ->where($filter)
        ->orderBy('scannings.station_id', 'asc')
        ->select('scannings.*', 'users.user', 'stations.station')
        ->get();
});
