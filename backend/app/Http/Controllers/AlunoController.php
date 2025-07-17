<?php

namespace App\Http\Controllers;

use App\Models\Aluno;
use Illuminate\Http\Request;

class AlunoController extends Controller
{
    /**
     * Lista todos os alunos.
     */
    public function index()
    {
        return Aluno::all();
    }

    /**
     * Cria um novo aluno.
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
        ]);

        $aluno = Aluno::create($validatedData);

        return response()->json($aluno, 201);
    }

    /**
     * Mostra um aluno específico.
     */
    public function show(Aluno $aluno)
    {
        return $aluno;
    }

    /**
     * Atualiza um aluno específico.
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
        ]);

        $aluno->update($validatedData);

        return response()->json($aluno);
    }

    /**
     * Deleta um aluno.
     */
    public function destroy(Aluno $aluno)
    {
        $aluno->delete();

        return response()->json(null, 204);
    }
}
