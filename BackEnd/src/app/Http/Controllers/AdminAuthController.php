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

        // Check if input is Email OR Username
        $admin = Admin::where('email', $request->emailOrUser)
                      ->orWhere('username', $request->emailOrUser)
                      ->first();

        // Validate Account, Password, and PIN
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

    // ... inside AdminAuthController class

    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'pin' => 'required',
            'new_password' => 'required|min:6'
        ]);

        // 1. Find Admin by Email
        $admin = Admin::where('email', $request->email)->first();

        // 2. Validate Admin Exists
        if (!$admin) {
            return response()->json(['message' => 'Email not found'], 404);
        }

        // 3. Verify the PIN matches the one in DB
        if ($admin->pin !== $request->pin) {
            return response()->json(['message' => 'Invalid Security PIN'], 401);
        }

        
        // 4. Update Password (Hash it!)
        $admin->password = Hash::make($request->new_password);
        $admin->save();

        return response()->json(['message' => 'Password reset successful! You can now login.']);
    }
}