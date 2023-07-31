<?php

namespace App\Http\Controllers;

use App\Models\Scanning;
use App\Models\Station;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;

class ScanningController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {

        //return date('Y-m-d H:i:s');
        $this->validateSession();

        return view('home', [
            'station' => Station::findOrFail(session('station'))
        ]);
    }

    public function store(Request $request)
    {

        $this->validateSession();

        $request->validate([
            'scanning' => ['required']
        ]);


        Scanning::create([
            'label' => $request->input('scanning'),
            'user_id' => request()->user()->id,
            'station_id' => session('station'),
        ]);

        DB::select('CALL`amazon_scanning`.`StoreBarCode`(?, ?)', [$request->input('scanning'), 'DT_SCANNING']);

        return response()->json([
            'message' => 'Record Inserted Successfully',
        ]);
    }


    public function getStationData()
    {
        return DB::table('scannings')
            ->join('users', 'scannings.user_id', '=', 'users.id')
            ->join('stations', 'scannings.station_id', '=', 'stations.id')
            ->where('scannings.station_id', session('station'))
            ->orderBy('scannings.id', 'desc')
            ->select('scannings.*', 'users.user', 'stations.station')
            ->limit(50)
            ->get();
    }

    public function validateSession()
    {
        $station = session('station');
        if (!isset($station)) {
            abort(403);
        }
    }
}
