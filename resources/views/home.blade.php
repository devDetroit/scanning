@extends('layouts.app')

@section('content')
<input type="hidden" id="StationDescriptionInput" value="{{ $station->station }}">
<input type="hidden" id="StationInput" value="{{ session('station') }}">
<div id="scanning"></div>
@endsection


@section('scripts')
<!-- Scripts -->
<script src="{{ asset('js/scanning.js') }}" defer></script>
@endsection