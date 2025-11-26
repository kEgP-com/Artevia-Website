<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // We actived this line to run your specific Product importer
        $this->call(ProductSeeder::class);
        
        // Removed: Product::factory()... (We don't want fake products anymore)
        // Removed: Category::factory()... (We will handle categories via the products for now)
        // Removed: Task::factory()... (This was from the tutorial, not needed for Ecommerce)
    }
}