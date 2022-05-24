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

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {

        $this->validateSession();

        $request->validate([
            'scanning' => ['required', Rule::unique('scannings', 'label')]
        ]);


        Scanning::create([
            'label' => $request->input('scanning'),
            'user_id' => request()->user()->id,
            'station_id' => session('station'),
        ]);

        return response()->json([
            'message' => 'Record Inserted Successfully',
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Scanning  $scanning
     * @return \Illuminate\Http\Response
     */
    public function show(Scanning $scanning)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Scanning  $scanning
     * @return \Illuminate\Http\Response
     */
    public function edit(Scanning $scanning)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Scanning  $scanning
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Scanning $scanning)
    {
        //
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

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Scanning  $scanning
     * @return \Illuminate\Http\Response
     */
    public function destroy(Scanning $scanning)
    {
        //
    }

    public function validateSession()
    {
        $station = session('station');
        if (!isset($station)) {
            abort(403);
        }
    }
}
