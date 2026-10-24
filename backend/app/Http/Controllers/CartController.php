<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;
// use App\Models\CartItem;

class CartController extends Controller
{
    public function index(Request $request)
    {
        $cartItems = Cart::with('product')
            ->where('user_id', $request->user()->id)
            ->get();

        $subtotal = $cartItems->sum(function ($item) {
            return $item->product->price * $item->quantity;
        });

        return response()->json([
            'success' => true,
            'cart' => $cartItems,
            'subtotal' => $subtotal,
            'total' => $subtotal
        ]);
    }
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $product = Product::findOrFail($request->product_id);

        // dd([
        //     'product_id' => $product->id,
        //     'product_name' => $product->name,
        //     'stock' => $product->stock,
        //     'quantity' => $request->quantity,
        // ]);

        // to stock validation stock me 5 products he or card me 6 aayga tab err dega 
        if ($request->quantity > $product->stock) {
            return response()->json([
                'success' => false,
                'message' => 'Quantity exceeds available stock.'
            ], 422);
        }

        $cartItem = Cart::where('user_id', $request->user()->id)
            ->where('product_id', $product->id)
            ->first(); //it return null  

        // dd($cartItem);
        if ($cartItem) {
            // Increase Quantity
            $newQuantity = $cartItem->quantity + $request->quantity;

            //validate 
            if ($newQuantity > $product->stock) {
                return response()->json([
                    'success' => false,
                    'message' => 'Quantity exceeds available stock.'
                ], 422);
            }

            $cartItem->quantity = $newQuantity;
            $cartItem->save();
        } else {

            $cartItem = Cart::create([
                'user_id' => $request->user()->id,
                'product_id' => $product->id,
                'quantity' => $request->quantity,
            ]);
        }

        // dd($cartItem);
        return response()->json([
            'success' => true,
            'message' => 'Product added to cart.',
            'cart_item' => $cartItem
        ]);
    }

    public function update(Request $request, int $id)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);


        $cartItem = Cart::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $product = Product::findOrFail($cartItem->product_id);

        if ($request->quantity > $product->stock) {

            return response()->json([
                'success' => false,
                'message' => 'Only ' . $product->stock . ' items available in stock.'
            ], 422);
        }

        $cartItem->quantity = $request->quantity;

        $cartItem->save();

        return response()->json([
            'success' => true,
            'message' => 'Cart quantity updated.',
            'cart_item' => $cartItem
        ]);
    }
    public function destroy(Request $request, int $id)
    {
        // Cart item find karo
        $cartItem = Cart::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();


        $cartItem->delete();

        return response()->json([
            'success' => true,
            'message' => 'Product removed from cart.'
        ]);
    }
    public function clear(Request $request)
    {
        Cart::where('user_id', $request->user()->id)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Cart cleared successfully.'
        ]);
    }
    public function count(Request $request)
    {
        $count = Cart::where('user_id', $request->user()->id)->count();

        return response()->json([
            'count' => $count

        ]);
    }
}
