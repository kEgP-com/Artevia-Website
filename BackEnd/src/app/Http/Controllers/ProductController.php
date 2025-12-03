<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage; 

class ProductController extends Controller
{
    // 1. GET ALL PRODUCTS
    public function index()
    {
        // Returns the list including the 'image_url' needed for the frontend
        return response()->json(Product::all());
    }

    // 2. GET SINGLE PRODUCT
    public function show($id)
    {
        $product = Product::find($id);
        if ($product) return response()->json($product);
        return response()->json(['message' => 'Product not found'], 404);
    }

    // 3. CREATE PRODUCT (Handles File Uploads)
    public function store(Request $request)
    {
        // Validation
        $request->validate([
            'name' => 'required|string',
            'price' => 'required|numeric',
            'category' => 'required|string',
            // Max 10MB image, must be a file type
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:10240' 
        ]);

        $data = $request->all();
        $imageUrl = null; // Default if upload fails

        // ✅ Handle File Upload
        // This saves to: storage/app/public/products/randomName.jpg
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $imageUrl = '/storage/' . $path; // The link the frontend needs
        }

        $product = Product::create([
            'name' => $data['name'],
            'artist' => $data['artist'] ?? 'Unknown', // Default value
            'category' => $data['category'],
            'price' => $data['price'],
            'description' => $data['description'] ?? '', // Default value
            'image_url' => $imageUrl
        ]);

        return response()->json(['message' => 'Product created', 'product' => $product], 201);
    }

    // 4. UPDATE PRODUCT
    public function update(Request $request, $id)
    {
        $product = Product::find($id);
        if (!$product) return response()->json(['message' => 'Product not found'], 404);

        // Validation (Image is explicitly OPTIONAL here)
        $request->validate([
            'name' => 'sometimes|string',
            'price' => 'sometimes|numeric',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:10240'
        ]);

        $data = $request->all();

        // ✅ Handle Image Update
        if ($request->hasFile('image')) {
            // 1. Delete old image to save space (Optional but recommended)
            if ($product->image_url) {
                // Remove '/storage/' to get the real path relative to the public disk
                $oldPath = str_replace('/storage/', '', $product->image_url);
                Storage::disk('public')->delete($oldPath);
            }

            // 2. Store new image
            $path = $request->file('image')->store('products', 'public');
            $data['image_url'] = '/storage/' . $path;
        }

        $product->update($data);
        return response()->json(['message' => 'Product updated', 'product' => $product]);
    }

    // 5. DELETE PRODUCT
    public function destroy($id)
    {
        $product = Product::find($id);
        if ($product) {
            // Clean up image file
            if ($product->image_url) {
                $oldPath = str_replace('/storage/', '', $product->image_url);
                Storage::disk('public')->delete($oldPath);
            }
            
            $product->delete();
            return response()->json(['message' => 'Product deleted']);
        }
        return response()->json(['message' => 'Product not found'], 404);
    }
}