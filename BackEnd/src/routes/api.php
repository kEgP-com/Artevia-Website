<?php
use App\Http\Controllers\AdminAuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UsersInfoController;
use App\Http\Controllers\ProductController; 
use App\Http\Controllers\ArtistController; 
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ContactMessageController;
// 1. Test Route
Route::get('/test', function () {
    return response()->json(['message' => 'API is working!']);
});

// User Authentication Routes
Route::post('/login', [UsersInfoController::class, 'login']);
Route::post('/register', [UsersInfoController::class, 'register']);
// Route::post('/reset-password', [UsersInfoController::class, 'resetPassword'])
Route::get('/users', [UsersInfoController::class, 'index']);
Route::get('/users/{id}', [UsersInfoController::class, 'show']);
Route::put('/users/{id}', [UsersInfoController::class, 'update']);

// Product Routes
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::post('/products', [ProductController::class, 'store']);
Route::put('/products/{id}', [ProductController::class, 'update']);
Route::delete('/products/{id}', [ProductController::class, 'destroy']);

// Artist Routes
Route::get('/artists', [ArtistController::class, 'index']);
Route::get('/artists/{id}', [ArtistController::class, 'show']);
Route::post('/artists', [ArtistController::class, 'store']); 
Route::put('/artists/{id}', [ArtistController::class, 'update']); 
Route::delete('/artists/{id}', [ArtistController::class, 'destroy']); 


// Cart Routes
Route::get('/cart', [CartController::class, 'index']);
Route::post('/cart', [CartController::class, 'addToCart']);
Route::put('/cart/{id}', [CartController::class, 'updateQuantity']);
Route::delete('/cart/{id}', [CartController::class, 'destroy']);
Route::post('/checkout', [CartController::class, 'checkout']);

// Order Routes



Route::get('/orders', [OrderController::class, 'index']);       // Get All (Admin) or Specific (Customer)
Route::post('/orders', [OrderController::class, 'store']);      // Create Order
Route::put('/orders/{id}', [OrderController::class, 'update']); // Admin Update Status
Route::delete('/orders/{id}', [OrderController::class, 'destroy']); // Admin Delete
Route::put('/orders/{id}/cancel', [OrderController::class, 'cancel']); // Customer Cancel
Route::put('/orders/{id}/rate', [OrderController::class, 'rate']);     // Customer Rate



// Message Routes
Route::get('/messages', [ContactMessageController::class, 'index']);
Route::post('/messages', [ContactMessageController::class, 'store']); // For Customer to send
Route::put('/messages/{id}', [ContactMessageController::class, 'update']); // For Admin to reply
Route::delete('/messages/{id}', [ContactMessageController::class, 'destroy']);

//admin
 Route::post('/admin/login', [AdminAuthController::class, 'login']);
 Route::post('/admin/reset-password', [AdminAuthController::class, 'resetPassword']);