<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\User;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();

        $defaultCategories = [
            ['name' => 'Work', 'color' => '#3B82F6'],
            ['name' => 'Personal', 'color' => '#10B981'],
            ['name' => 'Health', 'color' => '#F59E0B'],
            ['name' => 'Education', 'color' => '#8B5CF6'],
            ['name' => 'Finance', 'color' => '#EF4444'],
        ];

        foreach ($users as $user) {
            foreach ($defaultCategories as $category) {
                Category::create([
                    'user_id' => $user->id,
                    'name' => $category['name'],
                    'color' => $category['color'],
                ]);
            }
        }
    }
}
