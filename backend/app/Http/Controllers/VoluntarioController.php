<?php

namespace App\Http\Controllers;

use App\Models\Voluntario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class VoluntarioController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $voluntarios = Voluntario::all();

        return response()->json($voluntarios);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'nome' => 'required|string|max:100',
            'email' => 'required|string|email|max:100|unique:voluntarios',
            'senha' => 'required|string|min:6',
            'ativo' => 'sometimes|boolean',
        ]);

        $validatedData['senha'] = Hash::make($validatedData['senha']);

        $voluntario = Voluntario::create($validatedData);

        return response()->json($voluntario, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Voluntario $voluntario)
    {
        return response()->json($voluntario);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
