<?php

namespace App\Http\Controllers;

use App\Models\users_info;
use App\Models\SuspendedUser; // 👈 IMPORTS THE NEW MODEL
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UsersInfoController extends Controller
{
   
    public function register(Request $request) {
        $request->validate([
            'email' => 'required|email|unique:users_info',
            'password' => 'required'
        ]);

        $user = users_info::create([
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'name' => $request->name ?? 'New User', 
            // Default nulls to trigger "Incomplete Profile" on frontend
            'address' => $request->address ?? null, 
            'contact' => $request->contact ?? null, 
            'age' => $request->age ?? null,
            'is_banned' => false 
        ]);

        return response()->json(['message' => 'Registered successfully', 'user' => $user]);
    }


    public function login(Request $request) {
        $user = users_info::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        if ($user->is_banned) {
            $suspension = $user->suspension; 

         
            if ($suspension && $suspension->banned_until && now()->greaterThan($suspension->banned_until)) {
                $user->update(['is_banned' => false]);
                $suspension->delete(); 
            } 
            else {
              
                return response()->json([
                    'message' => 'Account Suspended',
                    'is_banned' => true,
                    'reason' => $suspension ? $suspension->reason : 'No reason provided.',
                    'type' => $suspension ? $suspension->type : 'permanent', // "permanent" or "temporary"
                    'until' => $suspension ? $suspension->banned_until : null
                ], 403);
            }
        }

        return response()->json(['message' => 'Login successful', 'user' => $user]);
    }

    public function update(Request $request, $id) {
        $user = users_info::find($id);
        
        if ($user) {
            $user->update($request->all());
            return response()->json(['message' => 'Updated successfully', 'user' => $user]);
        }
        
        return response()->json(['message' => 'User not found'], 404);
    }

   
    public function index() {
      
      return users_info::all();
    }


    public function show($id) {
        $user = users_info::find($id);
        if ($user) {
            return response()->json($user);
        }
        return response()->json(['message' => 'User not found'], 404);
    }

    
    public function resetPassword(Request $request) {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required' 
        ]);

        $user = users_info::where('email', $request->email)->first();

        if ($user) {
            $user->update([
                'password' => Hash::make($request->password)
            ]);
            return response()->json(['message' => 'Password reset successfully']);
        }

        return response()->json(['message' => 'Email not found'], 404);
    }


    public function toggleBan(Request $request, $id) {
        $user = users_info::find($id);
        if (!$user) return response()->json(['message' => 'User not found'], 404);

        $shouldBan = $request->input('is_banned');

        if ($shouldBan) {
            $user->update(['is_banned' => true]);

            SuspendedUser::updateOrCreate(
                ['user_id' => $user->id], 
                [
                    'reason' => $request->input('ban_reason'), 
                    'type' => $request->input('banned_until') ? 'temporary' : 'permanent',
                    'banned_until' => $request->input('banned_until')
                ]
            );
        } else {
            $user->update(['is_banned' => false]);
            if ($user->suspension) {
                $user->suspension->delete();
            }
        }

        return response()->json($user->fresh(['suspension']));
    }
}