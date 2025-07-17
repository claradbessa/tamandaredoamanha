<?php

namespace App\Http\Controllers;

use App\Models\Aula;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AulaController extends Controller
{
    /**
     * Lista todas as aulas, já incluindo os dados do voluntário responsável.
     */
    public function index()
    {
        // Usamos with('voluntario') para já carregar os dados do voluntário junto com a aula.
        // Isso é mais eficiente e evita múltiplas consultas ao banco (problema N+1).
        $aulas = Aula::with('voluntario')->get();
        return response()->json($aulas);
    }

    /**
     * Cria uma nova aula.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'nome' => 'required|string|max:100',
            'descricao' => 'nullable|string',
            'horario' => 'nullable|date_format:H:i',
            'dia_semana' => ['nullable', Rule::in(['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo'])],
            'voluntario_id' => 'nullable|exists:voluntarios,id', // Garante que o ID do voluntário existe na tabela 'voluntarios'
            'capacidade' => 'nullable|integer',
            'local_aula' => 'nullable|string|max:100',
        ]);

        $aula = Aula::create($validatedData);

        return response()->json($aula, 201);
    }

    /**
     * Mostra uma aula específica, incluindo os dados do voluntário.
     */
    public function show(Aula $aula)
    {
        // Carrega os dados do voluntário relacionado a esta aula.
        $aula->load('voluntario');
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
     * Deleta uma aula.
     */
    public function destroy(Aula $aula)
    {
        $aula->delete();

        return response()->json(null, 204);
    }
}
