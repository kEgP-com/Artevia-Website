<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use Illuminate\Support\Facades\File;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // List of files that contain PRODUCTS only
        $files = [
            'arts.json',
            'DigitalArts.json',
            'HandmadeDecors.json',
            'IllustrationSketch.json',
            'Painting.json',
            'productList.json',
            'Sculpture.json'
        ];

        foreach ($files as $filename) {
            // 1. Load the specific JSON file
            $path = database_path("seeders/data/{$filename}");
            
            // Check if file exists to prevent errors
            if (!File::exists($path)) {
                $this->command->info("Skipped: $filename (File not found)");
                continue;
            }

            $json = File::get($path);
            $products = json_decode($json, true);

            // 2. Insert into Database
            foreach ($products as $item) {
                Product::create([
                    // Handle 'name' vs 'title'
                    'name'        => $item['name'] ?? $item['title'] ?? 'Untitled',
                    
                    // Handle Category: If missing in JSON, use the filename as category
                    'category'    => $item['category'] ?? str_replace('.json', '', $filename),
                    
                    // Handle Artist
                    'artist'      => $item['artist'] ?? 'Unknown',
                    
                    // Handle Price (remove commas if string, prevent errors)
                    'price'       => isset($item['price']) ? (float)str_replace(',', '', $item['price']) : 0,
                    
                    'description' => $item['description'] ?? '',
                    'stock'       => 50, // Default stock
                    
                    // Handle Image variations
                    'image_url'   => $item['image_url'] ?? $item['imageUrl'] ?? $item['image'] ?? null,
                ]);
            }
            $this->command->info("Imported: $filename");
        }
    }
}