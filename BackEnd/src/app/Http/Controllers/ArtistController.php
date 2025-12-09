<?php

namespace App\Http\Controllers;

use App\Models\Artist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ArtistController extends Controller
{

    public function index()
    {
        return response()->json(Artist::all());
    }

    public function show($id)
    {
        $artist = Artist::find($id);
        if ($artist) return response()->json($artist);
        return response()->json(['message' => 'Artist not found'], 404);
    }


    public function store(Request $request)
    {
    
        $request->validate([
            'name' => 'required|string',
            'origin' => 'nullable|string', 
            'style' => 'nullable|string',  
            'email' => 'nullable|email',   
            'bio' => 'nullable|string',
            'image' => 'nullable|image|max:10240' 
        ]);

        $imageUrl = null;


        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('artists', 'public');
            $imageUrl = '/storage/' . $path;
        }

 
        $artist = Artist::create([
            'name' => $request->name,
            'origin' => $request->origin,
            'style' => $request->style,
            'email' => $request->email,
            'bio' => $request->bio,
            'profile_image' => $imageUrl
        ]);

        return response()->json(['message' => 'Artist created', 'artist' => $artist], 201);
    }


    public function update(Request $request, $id)
    {
        $artist = Artist::find($id);
        if (!$artist) return response()->json(['message' => 'Not found'], 404);

    
        $request->validate([
            'name' => 'required|string',
            'origin' => 'nullable|string',
            'style' => 'nullable|string',
            'email' => 'nullable|email',
            'bio' => 'nullable|string',
            'image' => 'nullable|image|max:10240'
        ]);

        $data = $request->all();

        
        if ($request->hasFile('image')) {
            if ($artist->profile_image) {
                $oldPath = str_replace('/storage/', '', $artist->profile_image);
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('image')->store('artists', 'public');
            $data['profile_image'] = '/storage/' . $path;
        }

        $artist->update($data);
        return response()->json(['message' => 'Artist updated', 'artist' => $artist]);
    }


    public function destroy($id)
    {
        $artist = Artist::find($id);
        if ($artist) {
         
            if ($artist->profile_image) {
                $oldPath = str_replace('/storage/', '', $artist->profile_image);
                Storage::disk('public')->delete($oldPath);
            }
            $artist->delete();
            return response()->json(['message' => 'Artist deleted']);
        }
        return response()->json(['message' => 'Not found'], 404);
    }
}