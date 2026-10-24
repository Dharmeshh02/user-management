<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function store(Request $request)
    {

        $request->validate([
            'name' => 'required|string',
            'phone' => 'required|string',
            'address' => 'required|string',
            'city' => 'required|string',
            'state' => 'required|string',
            'country' => 'required|string',
            'pincode' => 'required|string',
            'payment_method' => 'required|in:cod',
            'online'
        ]);


        $cartItems = Cart::with('product')
            ->where('user_id', $request->user()->id)
            ->get();


        if ($cartItems->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Your cart is empty.'
            ], 422);
        }

        DB::beginTransaction(); // Transaction sart krna or err aay to undo krna

        try {
            $subtotal = 0;

            // Check Stock & Calculate Subtotal
            foreach ($cartItems as $cartItem) {

                $product = Product::findOrFail($cartItem->product_id);

                if ($cartItem->quantity > $product->stock) {

                    return response()->json([
                        'message' => 'Not enough stock for ' . $product->name
                    ], 422);
                }

                $subtotal += $product->price * $cartItem->quantity;
            }


            $shipping = 100;


            $grandTotal = $subtotal + $shipping;

            // Create Order
            $order = Order::create([
                'user_id' => $request->user()->id,
                'name' => $request->name,
                'phone' => $request->phone,
                'address' => $request->address,
                'city' => $request->city,
                'state' => $request->state,
                'country' => $request->country,
                'pincode' => $request->pincode,
                'payment_method' => $request->payment_method,
                'subtotal' => $subtotal,
                'shipping' => $shipping,
                'grand_total' => $grandTotal,
                'status' => 'pending',
            ]);

            // Create Order Items
            foreach ($cartItems as $cartItem) {
                $product = Product::findOrFail($cartItem->product_id);

                $itemTotal = $product->price * $cartItem->quantity;

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $cartItem->quantity,
                    'price' => $product->price,
                    'total' => $itemTotal,
                ]);

                // database me stock update kre he product ka reduce krke  
                $product->stock -= $cartItem->quantity;
                $product->save();
            }

            // odr crete hone ke bad card clear 
            Cart::where('user_id', $request->user()->id)->delete();

            DB::commit();  // Changes save krti he db me


            return response()->json([
                'success' => true,
                'message' => 'Order placed successfully.',
                'order' => $order
            ], 201);
        } catch (\Exception $err) {  // Exception class hoti he php me pre difine or errs or Exception ko handle krne ke liye use hotihe


            DB::rollBack(); //agr koi err ho to u do kr deti he db me

            return response()->json([
                'success' => false,
                'message' => $err->getMessage()
            ], 422);
        }
    }
    public function index(Request $request)
    {
        $user = $request->user();

        $orders = Order::where('user_id', $user->id)->with('orderItems')->latest()->get();

        return response()->json([
            'success' => true,
            'orders' => $orders
        ]);
    }
    public function show(int $id)
    {

        $order = Order::with('orderItems.product')
            ->where('user_id', auth()->id())
            ->findOrFail($id);

        return response()->json([
            'order' => $order
        ]);
    }

    public function cancel(int $id)
    {
        $order = Order::where('user_id', auth()->id())
            ->findOrFail($id);

        if ($order->status !== 'pending') {
            return response()->json([
                'message' => 'Order cannot be cancelled.'
            ], 400);
        }

        $order->status = 'cancelled';
        $order->save();

        $order->load('orderItems.product');

        return response()->json([
            'message' => 'Order cancelled successfully.',
            'order' => $order
        ]);
    }


    //admin controller methords

    public function adminOrders()
    {
        $orders = Order::with([
            'user',
            'orderItems.product'
        ])
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'orders' => $orders
        ]);
    }
    public function adminShow(int $id)
    {
        $order = Order::with('orderItems.product')
            ->where('id', $id)
            ->firstOrFail();

        return response()->json([
            'success' => true,
            'order' => $order
        ]);
    }
    public function updateStatus(Request $request, int  $id)
    {
        $request->validate([
            'status' => 'required|in:pending,confirmed,shipped,delivered,cancelled'
        ]);

        $order = Order::findOrFail($id);

        $order->status = $request->status;
        $order->save();

        return response()->json([
            'success' => true,
            'message' => 'Order status updated successfully',
            'order' => $order
        ]);
    }
}
