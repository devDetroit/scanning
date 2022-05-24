<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        User::create([
            'user' => 'admin',
            'complete_name' => 'administrator',
            'email' => 'dortega@detroitaxle.com',
            'password' => Hash::make('admin'),
        ]);

        User::create([
            'user' => 'station1',
            'complete_name' => 'Station 1',
            'password' => Hash::make('station1'),
        ]);

        User::create([
            'user' => 'station2',
            'complete_name' => 'Station 2',
            'password' => Hash::make('station2'),
        ]);

        User::create([
            'user' => 'jgonzalez',
            'complete_name' => 'Jesus Gonzalez',
            'email' => 'jesusgonzalez@detroitaxle.com',
            'password' => Hash::make('jgonzalez'),
        ]);
    }
}
