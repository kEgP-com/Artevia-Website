<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ✅ Add every seeder you want to run here
        $this->call([
            ArtistSeeder::class,   // Runs first (creates Artists)
            ProductSeeder::class,
            UsersInfoSeeder::class,  
            AdminSeeder::class// Runs second (creates Products linked to Artists)
        ]);
    }
}