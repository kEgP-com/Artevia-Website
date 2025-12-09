<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Orders;
use App\Models\Cart;

class OrderController extends Controller
{
    
    public function index(Request $request)
    {
        $userId = $request->query('user_id'); 

        if ($userId) {
            return response()->json(
                Orders::where('user_id', $userId)
                      ->orderBy('created_at', 'desc')
                      ->get()
            );
        } else {
    
            $orders = DB::table('orders')
                ->join('users_info', 'orders.user_id', '=', 'users_info.id')
                ->select('orders.*', 'users_info.name as customer_name')
                ->orderBy('orders.created_at', 'desc')
                ->get();

            return response()->json($orders);
        }
    }


    public function store(Request $request)
    {
    
        $validated = $request->validate([
            'user_id' => 'required|integer',
            'items'   => 'required|array',
            'total'   => 'required|numeric',
            'address' => 'required|string',
            'payment' => 'required|string',
        ]);


        foreach ($validated['items'] as $itemData) {
            $item = (object) $itemData;
            
       
            $itemImage = isset($item->image) ? $item->image : 'no-image.png';
            
   
            $qty = $item->quantity ?? 1;
            $itemTotal = $item->price * $qty;

            Orders::create([
                'user_id'        => $validated['user_id'],
                'name'           => $item->name,
                'price'          => $item->price,
                'quantity'       => $qty,
                'image'          => $itemImage,
                'total_amount'   => $itemTotal,
                'address'        => $validated['address'],
                'contact'        => $request->input('contact'),
                'payment_method' => $validated['payment'],
                'status'         => 'Pending',
            ]);
        }

      
            $orderedItemIds = collect($request->items)->pluck('id');

        
            Cart::whereIn('id', $orderedItemIds)->delete();

        return response()->json(['message' => 'Orders placed successfully!']);
    }

    public function update(Request $request, $id)
    {
        $order = Orders::find($id);
        if ($order) {
            $order->update($request->only(['status', 'delivery_date', 'driver']));
            return response()->json(['message' => 'Order updated', 'order' => $order]);
        }
        return response()->json(['message' => 'Order not found'], 404);
    }

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


    public function destroy($id)
    {
        $order = Orders::find($id);
        if ($order) {
            $order->delete();
            return response()->json(['message' => 'Order deleted']);
        }
        return response()->json(['message' => 'Order not found'], 404);
    }


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

 
    public function clearHistory(Request $request)
    {
        $userId = $request->query('user_id');

        if ($userId) {
            Orders::where('user_id', $userId)->delete();
            return response()->json(['message' => 'History cleared successfully']);
        }
        
        return response()->json(['message' => 'User ID required'], 400);
    }

} 