<?php

namespace App\Providers;

use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Log para confirmar que o AppServiceProvider está rodando
        Log::info('[AppServiceProvider] Boot iniciado.');

        // Forçar HTTPS no ambiente de produção (como na Render)
        if ($this->app->environment('production')) {
            URL::forceScheme('https');
            Log::info('[AppServiceProvider] HTTPS forçado.');
        }

        // Garantir que o Storage use o disco público corretamente
        config(['filesystems.default' => 'public']);
        Log::info('[AppServiceProvider] Disco padrão configurado como public.');
    }
}
