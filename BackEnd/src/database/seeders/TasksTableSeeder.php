<?php

namespace Database\Seeders;
    /**
     * Run the database seeds.
     */
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class TasksTableSeeder extends Seeder
{
    public function run()
    {
        for ($i = 1; $i <= 10; $i++) {
            DB::table('tasks')->insert([
                'title' => "Sample Task $i",
                'description' => "Description for Task $i",
                'status' => 'pending',
                'due_date' => Carbon::now()->addDays($i)->toDateString(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}