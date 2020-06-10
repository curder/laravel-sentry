<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function() {
    return view('welcome');
});
Route::get('/debug-sentry', function() {
    throw new Exception('My first Sentry error!');
});
