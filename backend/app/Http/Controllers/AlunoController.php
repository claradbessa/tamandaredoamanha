<?php

namespace App\Http\Controllers;

use App\Models\Aluno;
use Illuminate\Http\Request;

class AlunoController extends Controller
{
    /**
     * Exibe uma listagem paginada do recurso, incluindo as aulas.
     */
    public function index()
    {
        return Aluno::with('aulas')->paginate(15);
    }

    /**
     * Armazena um novo aluno e sincroniza as suas matrículas.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'nome' => 'required|string|max:100',
            'data_nascimento' => 'required|date',
            'nome_responsaveis' => 'nullable|string|max:150',
            'telefone' => 'nullable|string|max:20',
            'endereco' => 'nullable|string',
            'observacoes' => 'nullable|string',
            'ativo' => 'sometimes|boolean',
            'aulas_ids' => 'nullable|array', // Valida que aulas_ids é um array
            'aulas_ids.*' => 'exists:aulas,id', // Valida que cada ID no array existe na tabela de aulas
        ]);

        $aluno = Aluno::create($validatedData);

        if (isset($validatedData['aulas_ids'])) {
            $aluno->aulas()->sync($validatedData['aulas_ids']);
        }

        return response()->json($aluno->load('aulas'), 201);
    }

    /**
     * Exibe o recurso especificado, incluindo as suas aulas.
     */
    public function show(Aluno $aluno)
    {
        return $aluno->load('aulas');
    }

    /**
     * Atualiza um aluno específico e sincroniza as suas matrículas.
     */
    public function update(Request $request, Aluno $aluno)
    {
        $validatedData = $request->validate([
            'nome' => 'sometimes|required|string|max:100',
            'data_nascimento' => 'sometimes|required|date',
            'nome_responsaveis' => 'nullable|string|max:150',
            'telefone' => 'nullable|string|max:20',
            'endereco' => 'nullable|string',
            'observacoes' => 'nullable|string',
            'ativo' => 'sometimes|boolean',
            'aulas_ids' => 'nullable|array',
            'aulas_ids.*' => 'exists:aulas,id',
        ]);

        $aluno->update($validatedData);

        if (isset($validatedData['aulas_ids'])) {
            $aluno->aulas()->sync($validatedData['aulas_ids']);
        }

        return response()->json($aluno->load('aulas'));
    }

    /**
     * Remove o recurso especificado.
     */
    public function destroy(Aluno $aluno)
    {
        $aluno->delete();

        return response()->json(null, 204);
    }
}
