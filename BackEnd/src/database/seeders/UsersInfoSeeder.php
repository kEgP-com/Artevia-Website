<?php
namespace Database\Seeders;
use App\Models\users_info;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;

class UsersInfoSeeder extends Seeder
{
    public function run(): void
    {
        $json = File::get(database_path('seeders/data/users.json'));
        $users = json_decode($json, true);

        foreach ($users as $user) {
            users_info::create([
                'name' => $user['name'],
                'email' => $user['email'],
                'password' => Hash::make($user['password']), // Hash the password from JSON
                'address' => $user['address'],
                'contact' => $user['contact'],
                'age' => $user['age'],
                'gcash' => $user['gcash'] ?? null,
                'paypal' => $user['paypal'] ?? null,
            ]);
        }
    }
}