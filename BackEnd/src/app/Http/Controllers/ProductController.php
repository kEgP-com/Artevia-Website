<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage; 

class ProductController extends Controller
{

    public function index()
    {
    
        return response()->json(Product::all());

        
    }
    public function indexOn()
    {
    
        $products = \Illuminate\Support\Facades\DB::table('products')
            ->join('artists', 'products.artist_id', '=', 'artists.id')
            ->select('products.*', 'artists.name as artist_name') 
            ->get();

        return response()->json($products);
    }


    public function show($id)
    {
        $product = Product::find($id);
        if ($product) return response()->json($product);
        return response()->json(['message' => 'Product not found'], 404);
    }

    public function store(Request $request)
    {
      
        $request->validate([
            'name' => 'required|string',
            'price' => 'required|numeric',
            'category' => 'required|string',
       
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:10240' 
        ]);

        $data = $request->all();
        $imageUrl = null; 


        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $imageUrl = '/storage/' . $path; 
        }

        $product = Product::create([
            'artist_id' => $request->artist_id, 
            'name' => $data['name'],
            'artist' => $data['artist'] ?? 'Unknown', 
            'category' => $data['category'],
            'price' => $data['price'],
            'description' => $data['description'] ?? '', 
            'image_url' => $imageUrl
        ]);

        return response()->json(['message' => 'Product created', 'product' => $product], 201);
    }


    public function update(Request $request, $id)
    {
        $product = Product::find($id);
        if (!$product) return response()->json(['message' => 'Product not found'], 404);


        $request->validate([
            'name' => 'sometimes|string',
            'price' => 'sometimes|numeric',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:10240'
        ]);

        $data = $request->all();

    
        if ($request->hasFile('image')) {
          
            if ($product->image_url) {
               
                $oldPath = str_replace('/storage/', '', $product->image_url);
                Storage::disk('public')->delete($oldPath);
            }

            
            $path = $request->file('image')->store('products', 'public');
            $data['image_url'] = '/storage/' . $path;
        }

        $product->update($data);
        return response()->json(['message' => 'Product updated', 'product' => $product]);
    }

    
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