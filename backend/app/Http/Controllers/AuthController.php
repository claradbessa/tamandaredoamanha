<?php

namespace App\Http\Controllers;

use App\Models\Voluntario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validatedData = $request->validate([
            'nome' => 'required|string|max:100',
            'email' => 'required|string|email|max:100|unique:voluntarios',
            'senha' => 'required|string|min:6|confirmed',
        ]);

        $voluntario = Voluntario::create([
            'nome' => $validatedData['nome'],
            'email' => $validatedData['email'],
            'senha' => Hash::make($validatedData['senha']),
        ]);

        $token = $voluntario->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $voluntario
        ], 201);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|string|email',
            'senha' => 'required|string',
        ]);

        $voluntario = Voluntario::where('email', $credentials['email'])->first();

        if (! $voluntario || ! Hash::check($credentials['senha'], $voluntario->senha)) {
            return response()->json(['message' => 'Credenciais inválidas'], 401);
        }

        $token = $voluntario->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $voluntario
        ]);
    }
}
