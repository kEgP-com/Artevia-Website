<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Admin;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        $json = File::get(database_path('seeders/data/admins.json'));
        $admins = json_decode($json, true);

        foreach ($admins as $admin) {
            Admin::updateOrCreate(
                ['email' => $admin['email']], // Check by email
                [
                    'username' => $admin['username'],
                    'password' => Hash::make($admin['password']), // ✅ Hash the password
                    'pin' => $admin['pin'] // Keeping PIN simple for now
                ]
            );
        }
    }
}