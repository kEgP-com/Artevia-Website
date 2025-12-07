<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use App\Models\users_info;
use Illuminate\Support\Facades\Hash;

class UsersInfoSeeder extends Seeder
{
    public function run(): void
    {
        // Ensure the path matches exactly where you put the file. 
        // Based on your error log, ensure the folder 'database/seeders/data/' exists.
        $json = File::get(database_path('seeders/data/users.json'));
        
        // 👇 FIX: Remove ', true' so it creates Objects, not Arrays
        $users = json_decode($json); 

        foreach ($users as $user) {
            users_info::create([
                'name' => $user->name, // Now this -> syntax will work
                'email' => $user->email,
                'password' => Hash::make($user->password), 
                'address' => $user->address,
                'contact' => $user->contact,
                'age' => $user->age,
                'gcash' => $user->gcash,
                'paypal' => $user->paypal,
                'is_banned' => false 
            ]);
        }
    }
}