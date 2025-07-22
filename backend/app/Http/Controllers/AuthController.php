<?php

namespace App\Http\Controllers;

use App\Models\Voluntario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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

        // Converte 'senha' para 'password' para o método attempt()
        $loginData = [
            'email' => $credentials['email'],
            'password' => $credentials['senha']
        ];

        if (!Auth::guard('voluntario')->attempt($loginData)) {
            return response()->json(['message' => 'Credenciais inválidas'], 401);
        }

        /** @var \App\Models\Voluntario $voluntario */
        $voluntario = Auth::guard('voluntario')->user();

        $token = $voluntario->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $voluntario
        ]);
    }
}
