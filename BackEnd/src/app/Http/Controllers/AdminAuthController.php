<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminAuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'emailOrUser' => 'required',
            'password' => 'required',
            'pin' => 'required'
        ]);

        $admin = Admin::where('email', $request->emailOrUser)
                      ->orWhere('username', $request->emailOrUser)
                      ->first();


        if (!$admin || !Hash::check($request->password, $admin->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        if ($admin->pin !== $request->pin) {
            return response()->json(['message' => 'Invalid Security PIN'], 401);
        }

        return response()->json([
            'message' => 'Login successful',
            'admin' => $admin
        ]);
    }



    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'pin' => 'required',
            'new_password' => 'required|min:6'
        ]);

       
        $admin = Admin::where('email', $request->email)->first();


        if (!$admin) {
            return response()->json(['message' => 'Email not found'], 404);
        }


        if ($admin->pin !== $request->pin) {
            return response()->json(['message' => 'Invalid Security PIN'], 401);
        }

        
        
        $admin->password = Hash::make($request->new_password);
        $admin->save();

        return response()->json(['message' => 'Password reset successful! You can now login.']);
    }
}