<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index() { return Category::all(); }

    public function store(Request $request) {
        $data = $request->validate([
            'name' => 'required|string',
            'description' => 'nullable|string'
        ]);
        return Category::create($data);
    }

    public function show($id) {
        try {
            $category = Category::findOrFail($id);
            return response()->json($category);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => "Category with ID $id not found"
            ], 404);
        }
    }


    public function update(Request $request, Category $category) {
        $category->update($request->all());
        return $category;
    }

    public function destroy(Category $category) {
        $category->delete();
        return response()->json(['message' => 'Category deleted successfully'], 204);
    }
}