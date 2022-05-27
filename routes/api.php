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


Route::get('/dashboard', function () {
    $currentDate =  date("Y-m-d");
    /*     $dateFilter = null;

    if (isset(request()->filterDate)) {
        $dateFilter = date_create(request()->filterDate);
        date_format($dateFilter, "Y-m-d");
    }

    return $dateFilter; */
    return response()->json(
        [
            "general" => DB::table('scannings')
                ->select(DB::raw('count(*) as totalScanned, stations.station'))
                ->join('stations', 'scannings.station_id', '=', 'stations.id')
                ->groupBy('stations.station')
                ->get(),

            "details" =>
            DB::table('scannings')
                ->select(DB::raw('count(*) as totalScanned, stations.station'))
                ->join('stations', 'scannings.station_id', '=', 'stations.id')
                ->where('scannings.created_at', '>=', isset(request()->filterDate) ? request()->filterDate . " 00:00:01" : "$currentDate 00:00:01")
                ->where('scannings.created_at', '<=', isset(request()->filterDate) ? request()->filterDate . " 23:59:59" : "$currentDate 23:59:59")
                ->groupBy('stations.station')
                ->get(),
            "groupData" =>
            DB::table('scannings')
                ->select(DB::raw('count(*) as totalItemFounds, label'))
                ->groupBy('label')
                ->having('totalItemFounds', '>', 1)
                ->get(),
        ]
    );
});
