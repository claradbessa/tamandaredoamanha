<?php

namespace App\Http\Controllers;

use App\Models\Matricula;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class MatriculaController extends Controller
{
    /**
     * Lista todas as matrículas.
     */
    public function index()
    {
        // Carrega os dados do aluno e da aula junto com cada matrícula
        return Matricula::with(['aluno', 'aula'])->get();
    }

    /**
     * Cria uma nova matrícula (inscreve um aluno em uma aula).
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'aluno_id' => 'required|exists:alunos,id',
            'aula_id' => [
                'required',
                'exists:aulas,id',
                // Validação para garantir que a combinação aluno/aula é única
                Rule::unique('matriculas')->where(function ($query) use ($request) {
                    return $query->where('aluno_id', $request->aluno_id);
                }),
            ],
            'ativo' => 'sometimes|boolean',
        ]);

        $matricula = Matricula::create($validatedData);

        return response()->json($matricula, 201);
    }

    /**
     * Mostra uma matrícula específica.
     */
    public function show(Matricula $matricula)
    {
        return $matricula->load(['aluno', 'aula']);
    }

    /**
     * Atualiza uma matrícula (ex: para desativá-la).
     */
    public function update(Request $request, Matricula $matricula)
    {
        $validatedData = $request->validate([
            'ativo' => 'required|boolean',
        ]);

        $matricula->update($validatedData);

        return response()->json($matricula);
    }

    /**
     * Deleta uma matrícula (cancela a inscrição).
     */
    public function destroy(Matricula $matricula)
    {
        $matricula->delete();

        return response()->json(null, 204);
    }
}
