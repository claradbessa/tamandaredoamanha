<?php



namespace App\Services;



use App\Models\Postagem;

use Illuminate\Support\Facades\Log;

use Illuminate\Support\Facades\Storage;



class PostagemService

{

  public function getAll()

  {

    return Postagem::with('voluntario')->orderBy('created_at', 'desc')->get();

  }



  public function create(array $data)

  {

    Log::info('[PostagemService] Iniciando criação de postagem.');

    try {

      if (isset($data['midia']) && $data['midia']->isValid()) {

        Log::info('[PostagemService] Salvando mídia.');

        $path = $data['midia']->store('uploads/midia', 'public');

        $data['midia'] = $path; // Guarda só o caminho relativo

      } else {

        Log::warning('[PostagemService] Nenhuma mídia válida enviada.');

      }



      $postagem = Postagem::create($data);

      Log::info('[PostagemService] Postagem criada com ID: ' . $postagem->id);

      return $postagem;



    } catch (\Throwable $e) {

      Log::error('[PostagemService] Erro ao criar postagem: ' . $e->getMessage());

      report($e);

      throw $e;

    }

  }



  public function update(Postagem $postagem, array $data)

  {

    Log::info("[PostagemService] Atualizando postagem ID: {$postagem->id}");

    try {

      if (isset($data['midia']) && $data['midia']->isValid()) {

        Log::info('[PostagemService] Substituindo mídia.');

        if ($postagem->midia) {

          Storage::disk('public')->delete($postagem->midia);

        }

        $path = $data['midia']->store('uploads/midia', 'public');

        $data['midia'] = $path;

      }



      $postagem->update($data);

      Log::info("[PostagemService] Postagem ID {$postagem->id} atualizada com sucesso.");

      return $postagem;



    } catch (\Throwable $e) {

      Log::error('[PostagemService] Erro ao atualizar postagem: ' . $e->getMessage());

      report($e);

      throw $e;

    }

  }



  public function delete(Postagem $postagem)

  {

    Log::info("[PostagemService] Deletando postagem ID: {$postagem->id}");

    try {

      if ($postagem->midia) {

        Storage::disk('public')->delete($postagem->midia);

      }

      $postagem->delete();

      Log::info("[PostagemService] Postagem ID {$postagem->id} deletada.");

    } catch (\Throwable $e) {

      Log::error('[PostagemService] Erro ao deletar postagem: ' . $e->getMessage());

      report($e);

      throw $e;

    }

  }

}


