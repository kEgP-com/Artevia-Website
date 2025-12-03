<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use Illuminate\Support\Facades\File;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $json = File::get(database_path('seeders/data/productList.json'));
        $products = json_decode($json, true);

        foreach ($products as $product) {
            Product::create([
                'name' => $product['name'],
                'artist' => $product['artist'],
                'category' => $product['category'],
                'price' => $product['price'],
                'description' => $product['description'],
                'image_url' => $product['imageUrl'] 
            ]);
        }
    }
}