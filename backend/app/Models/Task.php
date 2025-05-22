<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'category_id',
        'title',
        'description',
        'status',
        'priority',
        'due_date',
        'completed_at',
    ];

    protected $casts = [
        'due_date' => 'date',
        'completed_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function markAsCompleted()
    {
        $this->update([
            'status' => 'completed',
            'completed_at' => now(),
        ]);
    }

    public function markAsPending()
    {
        $this->update([
            'status' => 'pending',
            'completed_at' => null,
        ]);
    }

    public function isOverdue(): bool
{
    if (!$this->due_date || $this->status === 'completed') {
        return false;
    }

    return $this->due_date->isPast();
}

public function daysUntilDue(): ?int
{
    if (!$this->due_date || $this->status === 'completed') {
        return null;
    }

    $days = now()->diffInDays($this->due_date, false);
    return (int) $days;
}

public function scopeOverdue($query)
{
    return $query->where('due_date', '<', now()->toDateString())
                 ->where('status', '!=', 'completed');
}

public function scopePending($query)
{
    return $query->where('status', 'pending');
}

public function scopeInProgress($query)
{
    return $query->where('status', 'in_progress');
}

public function scopeCompleted($query)
{
    return $query->where('status', 'completed');
}

public function scopeHighPriority($query)
{
    return $query->where('priority', 'high');
}

public function scopeDueToday($query)
{
    return $query->whereDate('due_date', now()->toDateString());
}

public function scopeDueThisWeek($query)
{
    return $query->whereBetween('due_date', [
        now()->startOfWeek()->toDateString(),
        now()->endOfWeek()->toDateString()
    ]);
}
}
