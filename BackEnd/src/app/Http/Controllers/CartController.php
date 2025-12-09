<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Orders;
use Illuminate\Http\Request;

class CartController extends Controller
{

    public function index(Request $request)
    {

        $userId = $request->query('user_id');


        if (!$userId) {
            return response()->json([]);
        }


        $cartItems = Cart::where('user_id', $userId)->get();
        
        return response()->json($cartItems);
    }


    public function addToCart(Request $request)
    {
        
        $existingItem = Cart::where('user_id', $request->user_id)
                            ->where('product_id', $request->product_id)
                            ->first();

        if ($existingItem) {
          
            $existingItem->quantity += $request->quantity; 
            $existingItem->save();

            return response()->json([
                'message' => 'Quantity updated', 
                'data' => $existingItem
            ]);
        } else {
           
            $cart = Cart::create($request->all());
            
            return response()->json([
                'message' => 'Added to cart', 
                'data' => $cart
            ]);
        }
    }

    
    public function updateQuantity(Request $request, $id)
    {
        $cart = Cart::find($id);
        if ($cart) {
            $cart->quantity = $request->quantity;
            $cart->save();
            return response()->json(['message' => 'Quantity updated']);
        }
        return response()->json(['message' => 'Item not found'], 404);
    }


    public function destroy($id)
    {
        $cart = Cart::find($id);
        if ($cart) {
            $cart->delete();
            return response()->json(['message' => 'Item removed']);
        }
        return response()->json(['message' => 'Item not found'], 404);
    }


    public function checkout(Request $request)
    {
        $userId = $request->user_id;
        $cartItems = Cart::where('user_id', $userId)->get();

        if ($cartItems->isEmpty()) {
            return response()->json(['message' => 'Cart is empty'], 400);
        }

       
        foreach ($cartItems as $item) {
            Orders::create([
                'user_id' => $userId,
                'name' => $item->name,
                'price' => $item->price,
                'quantity' => $item->quantity,
                'image' => $item->image,
                'status' => 'Pending',
                'address' => $request->address,
                'contact' => $request->contact,
                'payment_method' => $request->payment_method,
                'total_amount' => $request->total_amount,
                'driver' => 'Assigning Driver...',
                'delivery_date' => 'Expected in 3-5 days' 
            ]);
            
          
            $item->delete();
        }

        return response()->json(['message' => 'Checkout successful!']);
    }
}