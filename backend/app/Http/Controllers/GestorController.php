<?php

namespace App\Http\Controllers;

use App\Models\Gestor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class GestorController extends Controller
{
    /**
     * Lista todos os gestores.
     */
    public function index()
    {
        return Gestor::all();
    }

    /**
     * Cria um novo gestor.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'nome' => 'required|string|max:100',
            'email' => 'required|string|email|max:100|unique:gestores',
            'senha' => 'required|string|min:6',
            'nivel_acesso' => ['sometimes', Rule::in(['basico', 'medio', 'alto'])],
        ]);

        $validatedData['senha'] = Hash::make($validatedData['senha']);

        $gestor = Gestor::create($validatedData);

        return response()->json($gestor, 201);
    }

    /**
     * Mostra um gestor específico.
     */
    public function show(Gestor $gestor)
    {
        return $gestor;
    }

    /**
     * Atualiza um gestor específico.
     */
    public function update(Request $request, Gestor $gestor)
    {
        $validatedData = $request->validate([
            'nome' => 'sometimes|required|string|max:100',
            'email' => [
                'sometimes',
                'required',
                'string',
                'email',
                'max:100',
                Rule::unique('gestores')->ignore($gestor->id),
            ],
            'senha' => 'sometimes|required|string|min:6',
            'nivel_acesso' => ['sometimes', Rule::in(['basico', 'medio', 'alto'])],
        ]);

        if ($request->filled('senha')) {
            $validatedData['senha'] = Hash::make($validatedData['senha']);
        }

        $gestor->update($validatedData);

        return response()->json($gestor);
    }

    /**
     * Deleta um gestor.
     */
    public function destroy(Gestor $gestor)
    {
        $gestor->delete();

        return response()->json(null, 204);
    }
}
