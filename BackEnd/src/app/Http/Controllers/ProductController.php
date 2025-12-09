<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    // 1. GET ALL PRODUCTS
    public function index()
    {
        return response()->json(Product::all());
    }

    public function indexOn()
    {
        $products = DB::table('products')
            ->join('artists', 'products.artist_id', '=', 'artists.id')
            ->select('products.*', 'artists.name as artist_name')
            ->get();

        return response()->json($products);
    }

    // 2. GET SINGLE PRODUCT
    public function show($id)
    {
        $product = Product::find($id);
        if ($product) return response()->json($product);
        return response()->json(['message' => 'Product not found'], 404);
    }

    // 3. CREATE PRODUCT (FIXED)
    public function store(Request $request)
    {
        // 1. Validate inputs (Includes artist_id check)
        $validated = $request->validate([
            'artist_id' => 'required|exists:artists,id', // Checks if artist ID exists in DB
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'category' => 'required|string',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:10240'
        ]);

        $data = $request->all();
        $imageUrl = null;

        // 2. Handle Image Upload
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $imageUrl = '/storage/' . $path;
        }

        // 3. Create Product
        // We look up the artist name automatically based on the ID to fill the 'artist' string column
        $artistName = DB::table('artists')->where('id', $request->artist_id)->value('name');

        $product = Product::create([
            'artist_id' => $request->artist_id,
            'name' => $data['name'],
            'artist' => $artistName ?? 'Unknown', // Auto-fill artist name
            'category' => $data['category'],
            'price' => $data['price'],
            'description' => $data['description'] ?? '',
            'image_url' => $imageUrl
        ]);

        return response()->json(['message' => 'Product created', 'product' => $product], 201);
    }

    // 4. UPDATE PRODUCT (FIXED)
    public function update(Request $request, $id)
    {
        $product = Product::find($id);
        if (!$product) return response()->json(['message' => 'Product not found'], 404);

        $request->validate([
            'artist_id' => 'sometimes|exists:artists,id',
            'name' => 'sometimes|string',
            'price' => 'sometimes|numeric',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:10240'
        ]);

        $data = $request->all();

        // If artist_id changed, update the artist name string too
        if ($request->has('artist_id')) {
            $artistName = DB::table('artists')->where('id', $request->artist_id)->value('name');
            $data['artist'] = $artistName;
        }

        if ($request->hasFile('image')) {
            // Delete old image
            if ($product->image_url) {
                $oldPath = str_replace('/storage/', '', $product->image_url);
                Storage::disk('public')->delete($oldPath);
            }
            // Store new image
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