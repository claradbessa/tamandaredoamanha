<?php

namespace App\Http\Controllers;

use App\Models\Aluno;
use Illuminate\Http\Request;

class AlunoController extends Controller
{
    /**
     * Lista todos os alunos, incluindo as suas aulas, horários e voluntários.
     */
    public function index()
    {
        return Aluno::with(['aulas.voluntario', 'aulas.horarios'])->paginate(15);
    }

    /**
     * Cria um novo aluno e sincroniza as suas matrículas.
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
            'aulas_ids' => 'nullable|array',
            'aulas_ids.*' => 'exists:aulas,id',
        ]);

        $aluno = Aluno::create($validatedData);

        if (isset($validatedData['aulas_ids'])) {
            $aluno->aulas()->sync($validatedData['aulas_ids']);
        }

        return response()->json($aluno->load(['aulas.voluntario', 'aulas.horarios']), 201);
    }

    /**
     * Mostra um aluno específico, incluindo as suas aulas, horários e voluntários.
     */
    public function show(Aluno $aluno)
    {
        return $aluno->load(['aulas.voluntario', 'aulas.horarios']);
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

        return response()->json($aluno->load(['aulas.voluntario', 'aulas.horarios']));
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
