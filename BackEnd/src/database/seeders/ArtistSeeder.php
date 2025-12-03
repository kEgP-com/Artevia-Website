<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Artist;
use Illuminate\Support\Facades\File;

class ArtistSeeder extends Seeder
{
    public function run(): void
    {

        $jsonPath = database_path('seeders/data/Artist.json');
        
        if (!File::exists($jsonPath)) {
            $this->command->error("File not found: $jsonPath");
            return;
        }

        $json = File::get($jsonPath);
        $artists = json_decode($json, true);
        foreach ($artists as $data) {
            
            Artist::updateOrCreate(
                ['name' => $data['name']], 
                [
                    'origin' => $data['origin'],
                    'style' => $data['style'],
                    'email' => $data['email'],
                    'bio' => $data['bio'],
                    'profile_image' => $data['profile_image'] ?? null 
                ]
            );
        }
        
        $this->command->info('Artists seeded successfully from JSON!');
    }
}