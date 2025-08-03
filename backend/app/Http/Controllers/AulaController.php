<?php

namespace App\Http\Controllers;

use App\Models\Aula;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class AulaController extends Controller
{
    public function index()
    {
        $aulas = Aula::with(['voluntario', 'horarios'])->paginate(15);
        return response()->json($aulas);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'nome' => 'required|string|max:100',
            'descricao' => 'nullable|string',
            'voluntario_id' => 'nullable|exists:voluntarios,id',
            'capacidade' => 'nullable|integer',
            'local_aula' => 'nullable|string|max:100',
            'horarios' => 'required|array|min:1',
            'horarios.*.dia_semana' => ['required', Rule::in(['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo'])],
            'horarios.*.horario' => 'required|date_format:H:i',
        ]);

        $aula = DB::transaction(function () use ($validatedData) {
            $aulaInstance = Aula::create($validatedData);
            $aulaInstance->horarios()->createMany($validatedData['horarios']);
            return $aulaInstance;
        });

        return response()->json($aula->load('horarios'), 201);
    }

    public function show(Aula $aula)
    {
        $aula->load(['voluntario', 'horarios']);
        return response()->json($aula);
    }

    public function update(Request $request, Aula $aula)
    {
        $validatedData = $request->validate([
            'nome' => 'sometimes|required|string|max:100',
            'descricao' => 'nullable|string',
            'voluntario_id' => 'nullable|exists:voluntarios,id',
            'capacidade' => 'nullable|integer',
            'local_aula' => 'nullable|string|max:100',
            'horarios' => 'sometimes|required|array|min:1',
            'horarios.*.dia_semana' => ['required', Rule::in(['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo'])],
            'horarios.*.horario' => 'required|date_format:H:i',
        ]);

        DB::transaction(function () use ($validatedData, $aula) {
            $aula->update($validatedData);
            if (isset($validatedData['horarios'])) {
                $aula->horarios()->delete();
                $aula->horarios()->createMany($validatedData['horarios']);
            }
        });

        return response()->json($aula->load('horarios'));
    }

    public function destroy(Aula $aula)
    {
        $aula->delete();
        return response()->json(null, 204);
    }

    /**
     * Retorna a lista de alunos matriculados numa aula específica.
     */
    public function getAlunos(Aula $aula)
    {
        return response()->json($aula->alunos);
    }
}
