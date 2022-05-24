<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Station extends Model
{
    use HasFactory;

    protected $fillable = ['station'];

    public function scanning()
    {
        return $this->hasMany(Scanning::class);
    }
}
