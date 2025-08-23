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
    public function boot(): void
    {
        Log::info('[AppServiceProvider] Boot iniciado.');

        // Força HTTPS e define o disco padrão com base no ambiente
        if ($this->app->environment('production')) {

            // Força HTTPS no ambiente de produção
            URL::forceScheme('https');
            Log::info('[AppServiceProvider] HTTPS forçado para produção.');

            // Define o disco padrão como 'cloudinary' APENAS em produção
            config(['filesystems.default' => 'cloudinary']);
            Log::info('[AppServiceProvider] Disco padrão configurado como CLOUDINARY para produção.');

        } else {

            // Em qualquer outro ambiente (como 'local'), usa 'public'
            config(['filesystems.default' => 'public']);
            Log::info('[AppServiceProvider] Disco padrão configurado como PUBLIC para ambiente local.');
        }
    }
}
