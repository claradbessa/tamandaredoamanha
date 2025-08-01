<?php

namespace App\Http\Controllers;

use App\Models\Aula;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class AulaController extends Controller
{
    /**
     * Exibe uma listagem do recurso.
     */
    public function index()
    {
        $aulas = Aula::with(['voluntario', 'horarios'])->get();
        return response()->json($aulas);
    }

    /**
     * Armazena um novo recurso.
     */
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

    /**
     * Exibe o recurso especificado.
     */
    public function show(Aula $aula)
    {
        $aula->load(['voluntario', 'horarios']);
        return response()->json($aula);
    }

    /**
     * Atualiza o recurso especificado.
     */
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

    /**
     * Remove o recurso especificado.
     */
    public function destroy(Aula $aula)
    {
        $aula->delete();
        return response()->json(null, 204);
    }
}
