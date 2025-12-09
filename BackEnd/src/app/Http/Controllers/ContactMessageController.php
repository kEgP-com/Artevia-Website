<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use Illuminate\Http\Request;

class ContactMessageController extends Controller
{

    public function index()
    {
        return response()->json(ContactMessage::orderBy('created_at', 'desc')->get());
    }


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

 
    public function update(Request $request, $id)
    {
        $msg = ContactMessage::find($id);
        if (!$msg) return response()->json(['message' => 'Message not found'], 404);

    
        $msg->update([
            'response' => $request->response,
            'status' => 'Resolved'
        ]);

        return response()->json(['message' => 'Message resolved', 'data' => $msg]);
    }

 
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