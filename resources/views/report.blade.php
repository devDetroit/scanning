@extends('layouts.app')

@section('content')
<div id="report"></div>
@endsection

@section('scripts')
<!-- Scripts -->
<script type="text/javascript" src="https://oss.sheetjs.com/sheetjs/xlsx.full.min.js"></script>
<script src="{{ asset('js/report.js') }}" defer></script>
@endsection