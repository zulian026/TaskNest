<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Task;
use Carbon\Carbon;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $query = $request->user()->tasks()->with('category');

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by priority
        if ($request->has('priority')) {
            $query->where('priority', $request->priority);
        }

        // Filter by category
        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // Filter by due date
        if ($request->has('due_date')) {
            $query->whereDate('due_date', $request->due_date);
        }

        // Search in title and description
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');

        if (in_array($sortBy, ['created_at', 'due_date', 'priority', 'status'])) {
            if ($sortBy === 'priority') {
                $query->orderByRaw("FIELD(priority, 'high', 'medium', 'low') " . ($sortOrder === 'desc' ? 'DESC' : 'ASC'));
            } else {
                $query->orderBy($sortBy, $sortOrder);
            }
        }

        $tasks = $query->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $tasks
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category_id' => 'nullable|exists:categories,id',
            'status' => 'in:pending,in_progress,completed',
            'priority' => 'in:low,medium,high',
            'due_date' => 'nullable|date|after_or_equal:today',
        ]);

        // Ensure category belongs to user
        if ($request->category_id) {
            $category = $request->user()->categories()->find($request->category_id);
            if (!$category) {
                return response()->json([
                    'success' => false,
                    'message' => 'Category not found'
                ], 404);
            }
        }

        $task = $request->user()->tasks()->create($request->all());
        $task->load('category');

        return response()->json([
            'success' => true,
            'message' => 'Task created successfully',
            'data' => $task
        ], 201);
    }

    public function show(Request $request, Task $task)
    {
        if ($task->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Task not found'
            ], 404);
        }

        $task->load('category');

        return response()->json([
            'success' => true,
            'data' => $task
        ]);
    }

    public function update(Request $request, Task $task)
    {
        if ($task->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Task not found'
            ], 404);
        }

        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'category_id' => 'nullable|exists:categories,id',
            'status' => 'in:pending,in_progress,completed',
            'priority' => 'in:low,medium,high',
            'due_date' => 'nullable|date',
        ]);

        // Ensure category belongs to user
        if ($request->category_id) {
            $category = $request->user()->categories()->find($request->category_id);
            if (!$category) {
                return response()->json([
                    'success' => false,
                    'message' => 'Category not found'
                ], 404);
            }
        }

        $task->update($request->all());
        $task->load('category');

        return response()->json([
            'success' => true,
            'message' => 'Task updated successfully',
            'data' => $task
        ]);
    }

    public function destroy(Request $request, Task $task)
    {
        if ($task->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Task not found'
            ], 404);
        }

        $task->delete();

        return response()->json([
            'success' => true,
            'message' => 'Task deleted successfully'
        ]);
    }

    public function updateStatus(Request $request, Task $task)
    {
        if ($task->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Task not found'
            ], 404);
        }

        $request->validate([
            'status' => 'required|in:pending,in_progress,completed',
        ]);

        if ($request->status === 'completed') {
            $task->markAsCompleted();
        } else {
            $task->update([
                'status' => $request->status,
                'completed_at' => null
            ]);
        }

        $task->load('category');

        return response()->json([
            'success' => true,
            'message' => 'Task status updated successfully',
            'data' => $task
        ]);
    }

    public function filterTasks(Request $request, $filter)
    {
        $query = $request->user()->tasks()->with('category');

        switch ($filter) {
            case 'pending':
                $query->where('status', 'pending');
                break;
            case 'in_progress':
                $query->where('status', 'in_progress');
                break;
            case 'completed':
                $query->where('status', 'completed');
                break;
            case 'overdue':
                $query->where('due_date', '<', Carbon::today())
                      ->where('status', '!=', 'completed');
                break;
            case 'today':
                $query->whereDate('due_date', Carbon::today());
                break;
            case 'this_week':
                $query->whereBetween('due_date', [
                    Carbon::now()->startOfWeek(),
                    Carbon::now()->endOfWeek()
                ]);
                break;
            case 'high_priority':
                $query->where('priority', 'high');
                break;
            default:
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid filter'
                ], 400);
        }

        $tasks = $query->orderBy('created_at', 'desc')->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $tasks
        ]);
    }
}
