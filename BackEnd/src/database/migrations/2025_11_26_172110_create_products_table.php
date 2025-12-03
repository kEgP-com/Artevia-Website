<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use Illuminate\Support\Facades\File;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // FIX: Point to the correct location inside 'src'
        $jsonPath = base_path('src/database/seeders/data/productList.json');

        // Safety Check: Verify file exists to prevent crashes
        if (!File::exists($jsonPath)) {
            $this->command->error("File not found at: " . $jsonPath);
            return;
        }

        $json = File::get($jsonPath);
        $products = json_decode($json, true);

        foreach ($products as $product) {
            Product::create([
                'name'        => $product['name'],
                'artist'      => $product['artist'] ?? null,
                'category'    => $product['category'],
                'price'       => $product['price'],
                'description' => $product['description'],
                'image_url'   => $product['imageUrl'] 
            ]);
        }
    }
}