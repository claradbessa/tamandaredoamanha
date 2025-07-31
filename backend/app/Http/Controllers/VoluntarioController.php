<?php

namespace App\Http\Controllers;

use App\Models\Voluntario;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Hash;

class VoluntarioController extends Controller
{
    /**
     * Exibe uma listagem do recurso.
     */
    public function index()
    {
        return Voluntario::all();
    }

    /**
     * Armazena um novo recurso.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'nome' => 'required|string|max:100',
            'email' => 'required|string|email|max:100|unique:voluntarios',
            'senha' => 'required|string|min:6|confirmed',
            'ativo' => 'sometimes|boolean',
            'cargo' => 'nullable|string|max:100',
        ]);

        $validatedData['senha'] = Hash::make($validatedData['senha']);

        $voluntario = Voluntario::create($validatedData);

        return response()->json($voluntario, 201);
    }

    /**
     * Exibe o recurso especificado.
     */
    public function show(Voluntario $voluntario)
    {
        return $voluntario;
    }

    /**
     * Atualiza o recurso especificado.
     */
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
            'senha' => 'nullable|string|min:6|confirmed',
            'ativo' => 'sometimes|boolean',
            'cargo' => 'nullable|string|max:100',
        ]);

        if ($request->filled('senha')) {
            $validatedData['senha'] = Hash::make($validatedData['senha']);
        }

        $voluntario->update($validatedData);

        return response()->json($voluntario);
    }

    /**
     * Remove o recurso especificado.
     */
    public function destroy(Voluntario $voluntario)
    {
        $voluntario->delete();

        return response()->json(null, 204);
    }
}
