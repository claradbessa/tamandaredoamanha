<?php

namespace App\Http\Controllers;

use App\Models\Frequencia;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class FrequenciaController extends Controller
{
    /**
     * Lista todos os registros de frequência.
     */
    public function index()
    {
        // Carrega os dados do aluno, aula e voluntário que registrou
        return Frequencia::with(['aluno', 'aula', 'voluntario'])->get();
    }

    /**
     * Cria um novo registro de frequência.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'aluno_id' => 'required|exists:alunos,id',
            'aula_id' => 'required|exists:aulas,id',
            'data' => [
                'required',
                'date',
                // Garante que a combinação de aluno, aula e data seja única
                Rule::unique('frequencias')->where(function ($query) use ($request) {
                    return $query->where('aluno_id', $request->aluno_id)
                                 ->where('aula_id', $request->aula_id);
                }),
            ],
            'presenca' => 'required|boolean',
            'observacoes' => 'nullable|string',
            'registrado_por' => 'required|exists:voluntarios,id',
        ]);

        $frequencia = Frequencia::create($validatedData);

        return response()->json($frequencia, 201);
    }

    /**
     * Mostra um registro de frequência específico.
     */
    public function show(Frequencia $frequencia)
    {
        return $frequencia->load(['aluno', 'aula', 'voluntario']);
    }

    /**
     * Atualiza um registro de frequência.
     */
    public function update(Request $request, Frequencia $frequencia)
    {
        $validatedData = $request->validate([
            'presenca' => 'sometimes|required|boolean',
            'observacoes' => 'nullable|string',
        ]);

        $frequencia->update($validatedData);

        return response()->json($frequencia);
    }

    /**
     * Deleta um registro de frequência.
     */
    public function destroy(Frequencia $frequencia)
    {
        $frequencia->delete();

        return response()->json(null, 204);
    }
}
