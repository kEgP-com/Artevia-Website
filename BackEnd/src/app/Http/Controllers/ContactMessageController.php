<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use Illuminate\Http\Request;

class ContactMessageController extends Controller
{
    // 1. GET ALL MESSAGES
    public function index()
    {
        return response()->json(ContactMessage::orderBy('created_at', 'desc')->get());
    }

    // 2. STORE NEW MESSAGE (For your Public "Contact Us" page later)
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'email' => 'required|email',
            'subject' => 'required',
            'message' => 'required'
        ]);

        ContactMessage::create($request->all());

        return response()->json(['message' => 'Message sent successfully!']);
    }

    // 3. REPLY / MARK RESOLVED
    public function update(Request $request, $id)
    {
        $msg = ContactMessage::find($id);
        if (!$msg) return response()->json(['message' => 'Message not found'], 404);

        // Update response and status
        $msg->update([
            'response' => $request->response,
            'status' => 'Resolved'
        ]);

        return response()->json(['message' => 'Message resolved', 'data' => $msg]);
    }

    // 4. DELETE MESSAGE
    public function destroy($id)
    {
        $msg = ContactMessage::find($id);
        if ($msg) {
            $msg->delete();
            return response()->json(['message' => 'Message deleted']);
        }
        return response()->json(['message' => 'Message not found'], 404);
    }
}