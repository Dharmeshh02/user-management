<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::all();

        return response()->json([
            'products' => $products
        ]);
    }

    public function store(Request $request)
    {
        $imagePath = null;

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('products', 'public');
        }

        $product = Product::create([
            'name' => $request->name,
            'sku' => $request->sku,
            'category_id' => $request->category_id,
            'price' => $request->price,
            'stock' => $request->stock,
            'image' => $imagePath,
            'status' => 1,
        ]);

        return response()->json([
            'message' => 'Product created successfully',
            'product' => $product
        ]);
    }

    public function update(Request $request, int $id)
    {
        $product = Product::findOrFail($id);

        $product->name = $request->name;
        $product->sku = $request->sku;
        $product->category_id = $request->category_id;
        $product->price = $request->price;
        $product->stock = $request->stock;

        if ($request->hasFile('image')) {

            $path = $request->file('image')
                ->store('products', 'public');

            $product->image = $path;
        }

        $product->save();

        return response()->json([
            'message' => 'Product updated successfully',
            'product' => $product
        ]);
    }
    public function destroy(int $id)
    {
        $product = Product::findOrFail($id);

        $product->delete();

        return response()->json([
            'message' => 'Product deleted successfully'
        ]);
    }

    public function toggleStatus(int $id)
    {
        $product = Product::findOrFail($id);

        $product->status = $product->status ? 0 : 1;
        $product->save();

        return response()->json([
            'message' => 'Product status updated successfully',
            'status' => $product->status
        ]);
    }

    //User Controllers
    public function customerProducts(Request $request)
    {
        $products = Product::with('category')
            ->where('status', 1);

        if ($request->category_id) {
            $products->where('category_id', $request->category_id);
        }

        if ($request->sort == 'price_asc') {
            $products->orderBy('price', 'asc');
        }

        if ($request->sort == 'price_desc') {
            $products->orderBy('price', 'desc');
        }

        if ($request->search) {
            $products->where('name', 'like', '%' . $request->search . '%');
        }
        // dd($products);
        $products = $products->paginate(6);

        return response()->json([
            'success' => true,
            'products' => $products
        ]);
    }


    public function show(int $id)
    {
        $product = Product::with('category')
            ->where('id', $id)
            ->where('status', 1)
            ->first();

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'product' => $product
        ]);
    }
}
