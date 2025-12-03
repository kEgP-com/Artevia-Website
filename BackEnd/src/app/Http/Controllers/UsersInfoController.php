<?php

namespace App\Http\Controllers;

use App\Models\users_info;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UsersInfoController extends Controller
{
    // 1. REGISTER
    public function register(Request $request) {
        $request->validate([
            'email' => 'required|email|unique:users_infos',
            'password' => 'required'
        ]);

        $user = users_info::create([
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'name' => 'New User', 
            'address' => 'Update your address',
            'contact' => '0000000000',
            'age' => 18
        ]);

        return response()->json(['message' => 'Registered successfully', 'user' => $user]);
    }

    // 2. LOGIN
    public function login(Request $request) {
        $user = users_info::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        return response()->json(['message' => 'Login successful', 'user' => $user]);
    }
// 6. GET SINGLE USER (Add this function)
    public function show($id) {
        $user = users_info::find($id);
        if ($user) {
            return response()->json($user);
        }
        return response()->json(['message' => 'User not found'], 404);
    }
    // 3. UPDATE
    public function update(Request $request, $id) {
        $user = users_info::find($id);
        
        if ($user) {
            $user->update($request->all());
            return response()->json(['message' => 'Updated successfully', 'user' => $user]);
        }
        
        return response()->json(['message' => 'User not found'], 404);
    }

    // 4. GET ALL USERS (ADDED THIS)
    public function index() {
        return users_info::all();
    }
}