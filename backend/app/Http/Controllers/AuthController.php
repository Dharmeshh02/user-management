<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;


class AuthController extends Controller
{
    // REGISTER
    public function register(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|min:6|confirmed',
        ]);

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'role'     => 'user',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Registration successful',
            'user'    => $user,
        ], 201);
    }



    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // dd($credentials);
        if (Auth::attempt($credentials)) {
            // dd('LOGIN SUCCESS');
            $user = Auth::user();

            // $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'message' => 'Login successful!',
                'user' => $user,
                // 'token' => $token,
            ], 200);
        }

        return response()->json([
            'message' => 'Invalid login credentials!',
        ], 401);
    }

    // LOGOUT
    public function logout(Request $request)
    {
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'success' => true,
            'message' => 'Logout successfully',
        ]);
    }

    // PROFILE
    public function profile(Request $request)
    {
        return response()->json([
            'success' => true,
            'user'    => $request->user(),
        ]);
    }


    // UPDATE PROFILE
    // public function updateProfile(Request $request)
    // {
    //     $request->validate([
    //         'name'  => 'required|string|max:255',
    //         'email' => 'required|email|max:255',
    //     ]);

    //     $user = $request->user();

    //     $user->name = $request->name;
    //     $user->email = $request->email;
    //     $user->save();

    //     return response()->json([
    //         'success' => true,
    //         'message' => 'Profile updated successfully',
    //         'user'    => $user,
    //     ]);
    // }
    public function updateProfile(Request $request)
    {
        $user = $request->user();
        // dd($user);
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email',
            'phone' => 'nullable|string',
            'gender' => 'nullable|string',
            'profile_photo' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $user->name = $request->name; // $request se name nikal kr user ke name fild me save kr rha hu
        $user->email = $request->email;
        $user->phone = $request->phone;
        $user->gender = $request->gender;
        // request me photo he to if ke bolock me ja

        if ($request->hasFile('profile_photo')) {
            //object = me request se 
            $path = $request->file('profile_photo')
                ->store('profile_photos', 'public');

            $user->profile_photo = $path;
        }

        $user->save();

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user
        ]);
    }
}
