<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Auth\GitHubAuthController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Categories
    Route::apiResource('categories', CategoryController::class);

    // Tasks
    Route::apiResource('tasks', TaskController::class);
    Route::patch('/tasks/{task}/status', [TaskController::class, 'updateStatus']);
    Route::get('/tasks/filter/{filter}', [TaskController::class, 'filterTasks']);
});

Route::prefix('auth/github')->group(function () {
    Route::get('redirect', [GitHubAuthController::class, 'redirectToGitHub']);
    Route::get('callback', [GitHubAuthController::class, 'handleGitHubCallback']);
    Route::post('unlink', [GitHubAuthController::class, 'unlinkGitHub'])->middleware('auth:sanctum');
});
