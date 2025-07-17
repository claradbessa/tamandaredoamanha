<?php

namespace App\Http\Controllers;

use App\Models\Voluntario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class VoluntarioController extends Controller
{
    public function index()
    {
        $voluntarios = Voluntario::all();
        return response()->json($voluntarios);
    }

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

    public function show(Voluntario $voluntario)
    {
        return response()->json($voluntario);
    }

    public function update(Request $request, Voluntario $voluntario)
    {
        $validatedData = $request->validate([
            'nome' => 'sometimes|required|string|max:100',
            'email' => [
                'sometimes',
                'required',
                'string',
                'email',
                'max:100',
                Rule::unique('voluntarios')->ignore($voluntario->id),
            ],
            'senha' => 'sometimes|required|string|min:6',
            'ativo' => 'sometimes|boolean',
        ]);

        if ($request->filled('senha')) {
            $validatedData['senha'] = Hash::make($validatedData['senha']);
        }

        $voluntario->update($validatedData);

        return response()->json($voluntario);
    }

    public function destroy(string $id)
    {
        //
    }
}
