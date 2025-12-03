<?php

namespace App\Http\Controllers;

use App\Models\Orders; 
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB; // Needed for Joins

class OrderController extends Controller
{
    // 1. GET ORDERS (Handles both Customer & Admin)
    public function index(Request $request)
    {
        $userId = $request->query('user_id'); 

        if ($userId) {
            // Case A: Customer fetching their own orders
            return response()->json(
                Orders::where('user_id', $userId)
                     ->orderBy('created_at', 'desc')
                     ->get()
            );
        } else {
            // Case B: Admin fetching ALL orders
            // We join with 'users_info' to get the customer's name
            $orders = DB::table('orders')
                ->join('users_info', 'orders.user_id', '=', 'users_info.id')
                ->select('orders.*', 'users_info.name as customer_name')
                ->orderBy('orders.created_at', 'desc')
                ->get();

            return response()->json($orders);
        }
    }

    // 2. CHECKOUT (Create New Order)
    public function store(Request $request)
    {
        $order = Orders::create([
            'user_id' => $request->user_id,
            'name' => $request->name,
            'price' => $request->price,
            'quantity' => $request->quantity,
            'image' => $request->image,
            'status' => 'Pending',
            'address' => $request->address,
            'contact' => $request->contact,
            'payment_method' => $request->payment_method,
            'total_amount' => $request->total_amount,
            'delivery_date' => 'Expected in 3-5 days',
            'driver' => 'Assigning Driver...'
        ]);

        return response()->json(['message' => 'Order placed successfully', 'order' => $order]);
    }

    // 3. UPDATE ORDER STATUS (Admin Feature)
    public function update(Request $request, $id)
    {
        $order = Orders::find($id);
        if ($order) {
            // Only update fields that are sent
            $order->update($request->only(['status', 'delivery_date', 'driver']));
            return response()->json(['message' => 'Order updated', 'order' => $order]);
        }
        return response()->json(['message' => 'Order not found'], 404);
    }

    // 4. CANCEL ORDER (Customer Feature)
    public function cancel($id)
    {
        $order = Orders::find($id);
        if ($order && $order->status === 'Pending') {
            $order->status = 'Cancelled';
            $order->save();
            return response()->json(['message' => 'Order cancelled', 'order' => $order]);
        }
        return response()->json(['message' => 'Cannot cancel this order'], 400);
    }

    // 5. DELETE ORDER (Admin Feature)
    public function destroy($id)
    {
        $order = Orders::find($id);
        if ($order) {
            $order->delete();
            return response()->json(['message' => 'Order deleted']);
        }
        return response()->json(['message' => 'Order not found'], 404);
    }

    // 6. RATE ORDER
    public function rate(Request $request, $id)
    {
        $order = Orders::find($id);
        if ($order) {
            $order->rating = $request->rating;
            $order->save();
            return response()->json(['message' => 'Order rated', 'order' => $order]);
        }
        return response()->json(['message' => 'Order not found'], 404);
    }
}