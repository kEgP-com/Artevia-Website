<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Orders;
use Illuminate\Http\Request;

class CartController extends Controller
{
    // 1. GET CART ITEMS
    public function index(Request $request)
    {
        $userId = $request->query('user_id');
        return response()->json(Cart::where('user_id', $userId)->get());
    }

    // 2. ADD TO CART
    public function addToCart(Request $request)
    {
        $cart = Cart::create($request->all());
        return response()->json(['message' => 'Added to cart', 'data' => $cart]);
    }

    // 3. UPDATE QUANTITY
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

    // 4. REMOVE ITEM
    public function destroy($id)
    {
        $cart = Cart::find($id);
        if ($cart) {
            $cart->delete();
            return response()->json(['message' => 'Item removed']);
        }
        return response()->json(['message' => 'Item not found'], 404);
    }

    // 5. CHECKOUT (Cart -> Order Table)
    public function checkout(Request $request)
    {
        $userId = $request->user_id;
        $cartItems = Cart::where('user_id', $userId)->get();

        if ($cartItems->isEmpty()) {
            return response()->json(['message' => 'Cart is empty'], 400);
        }

        // Move items from Cart Table to Order Table
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
            
            // Delete from Cart Table
            $item->delete();
        }

        return response()->json(['message' => 'Checkout successful!']);
    }
}