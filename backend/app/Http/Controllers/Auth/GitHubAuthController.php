<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\GitHubProvider;

class GitHubAuthController extends Controller
{
    public function redirectToGitHub()
    {
        try {
            /** @var GitHubProvider $driver */
            $driver = Socialite::driver('github');
            $url = $driver->stateless()->redirect()->getTargetUrl();

            return response()->json([
                'success' => true,
                'url' => $url
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error redirecting to GitHub: ' . $e->getMessage()
            ], 500);
        }
    }

    public function handleGitHubCallback(Request $request)
    {
        try {
            /** @var GitHubProvider $driver */
            $driver = Socialite::driver('github');
            $githubUser = $driver->stateless()->user();

            // Cari user berdasarkan GitHub ID atau email
            $user = User::where('github_id', $githubUser->id)
                       ->orWhere('email', $githubUser->email)
                       ->first();

            if ($user) {
                // Update existing user dengan GitHub info
                $user->update([
                    'github_id' => $githubUser->id,
                    'avatar' => $githubUser->avatar,
                    'provider' => 'github',
                ]);
            } else {
                // Buat user baru
                $user = User::create([
                    'name' => $githubUser->name ?? $githubUser->nickname,
                    'email' => $githubUser->email,
                    'github_id' => $githubUser->id,
                    'avatar' => $githubUser->avatar,
                    'provider' => 'github',
                    'email_verified_at' => now(),
                ]);
            }

            // Buat token
            $token = $user->createToken('auth_token')->plainTextToken;

            // Redirect ke frontend dengan token
            $frontendUrl = config('app.frontend_url', 'http://localhost:3000');

            return redirect()->away(
                $frontendUrl . '/auth/callback?token=' . $token . '&user=' . base64_encode(json_encode([
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'avatar' => $user->avatar,
                ]))
            );

        } catch (\Exception $e) {
            $frontendUrl = config('app.frontend_url', 'http://localhost:3000');
            return redirect()->away(
                $frontendUrl . '/login?error=' . urlencode('GitHub login failed: ' . $e->getMessage())
            );
        }
    }

    public function unlinkGitHub(Request $request)
    {
        try {
            $user = $request->user();

            // Pastikan user memiliki password sebelum unlink GitHub
            if (!$user->password && $user->provider === 'github') {
                return response()->json([
                    'success' => false,
                    'message' => 'Anda perlu mengatur password terlebih dahulu sebelum memutus koneksi GitHub.'
                ], 400);
            }

            $user->update([
                'github_id' => null,
                'provider' => 'email',
            ]);

            return response()->json([
                'success' => true,
                'message' => 'GitHub account berhasil diputus koneksinya.'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error unlinking GitHub: ' . $e->getMessage()
            ], 500);
        }
    }
}
