@extends('layouts.app')

@section('content')
<input type="hidden" id="StationDescriptionInput" value="{{ $station->station }}">
<input type="hidden" id="StationInput" value="{{ session('station') }}">
<input type="hidden" id="userID" value="{{ request()->user()->complete_name }}">
<div id="scanning"></div>
@endsection


@section('scripts')
<!-- Scripts -->
<script src="{{ asset('js/scanning.js') }}" defer></script>
@endsection