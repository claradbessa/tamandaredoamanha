<?php

namespace App\Http\Controllers;

use App\Models\Aula;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AulaController extends Controller
{
    /**
     * Lista todas as aulas, incluindo os voluntários e os alunos matriculados.
     */
    public function index()
    {
        $aulas = Aula::with(['voluntario', 'alunos'])->get(); 
        return response()->json($aulas);
    }

    /**
     * Armazena uma nova aula.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'nome' => 'required|string|max:100',
            'descricao' => 'nullable|string',
            'horario' => 'nullable|date_format:H:i',
            'dia_semana' => ['nullable', Rule::in(['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo'])],
            'voluntario_id' => 'nullable|exists:voluntarios,id',
            'capacidade' => 'nullable|integer',
            'local_aula' => 'nullable|string|max:100',
        ]);

        $aula = Aula::create($validatedData);
        return response()->json($aula, 201);
    }

    /**
     * Exibe uma aula específica, incluindo o voluntário e os alunos matriculados.
     */
    public function show(Aula $aula)
    {
        $aula->load(['voluntario', 'alunos']);
        return response()->json($aula);
    }

    /**
     * Atualiza uma aula específica.
     */
    public function update(Request $request, Aula $aula)
    {
        $validatedData = $request->validate([
            'nome' => 'sometimes|required|string|max:100',
            'descricao' => 'nullable|string',
            'horario' => 'nullable|date_format:H:i',
            'dia_semana' => ['nullable', Rule::in(['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo'])],
            'voluntario_id' => 'nullable|exists:voluntarios,id',
            'capacidade' => 'nullable|integer',
            'local_aula' => 'nullable|string|max:100',
        ]);

        $aula->update($validatedData);
        return response()->json($aula);
    }

    /**
     * Remove uma aula específica.
     */
    public function destroy(Aula $aula)
    {
        $aula->delete();
        return response()->json(null, 204);
    }
}
