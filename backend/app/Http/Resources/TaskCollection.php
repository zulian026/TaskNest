<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class TaskCollection extends ResourceCollection
{
    public function toArray(Request $request): array
    {
        return [
            'data' => $this->collection,
            'meta' => [
                'total_tasks' => $this->collection->count(),
                'completed_tasks' => $this->collection->where('status', 'completed')->count(),
                'pending_tasks' => $this->collection->where('status', 'pending')->count(),
                'in_progress_tasks' => $this->collection->where('status', 'in_progress')->count(),
                'overdue_tasks' => $this->collection->filter(function ($task) {
                    return $task->isOverdue();
                })->count(),
            ],
        ];
    }
}
