'use client';

import React, { useState } from 'react';
import { CheckCircle2, Circle, Plus, Trash2, AlertCircle, Clock } from 'lucide-react';
import { useTodos, useCreateTodo, useUpdateTodo, useDeleteTodo } from '../hooks/useTodos';

const PRIORITY_COLORS = {
  high: 'text-pink-500',
  medium: 'text-amber-500',
  low: 'text-green-500',
};

const PRIORITY_BG_COLORS = {
  high: 'bg-pink-500/10',
  medium: 'bg-amber-500/10',
  low: 'bg-green-500/10',
};

export function TodoWidget() {
  const { data: todos, isLoading } = useTodos();
  const createTodo = useCreateTodo();
  const updateTodo = useUpdateTodo();
  const deleteTodo = useDeleteTodo();
  const [newTodoText, setNewTodoText] = useState('');
  const [newTodoPriority, setNewTodoPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = () => {
    if (newTodoText.trim()) {
      createTodo.mutate({ text: newTodoText, priority: newTodoPriority });
      setNewTodoText('');
      setIsAdding(false);
    }
  };

  const toggleTodo = (id: string, isDone: boolean) => {
    updateTodo.mutate({ id, is_done: !isDone });
  };

  if (isLoading) {
    return (
      <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-4 h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
      </div>
    );
  }

  const pendingTodos = todos?.filter(t => !t.is_done) || [];
  const completedTodos = todos?.filter(t => t.is_done) || [];

  return (
    <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-zinc-400" />
          <h3 className="text-sm font-medium text-white">Todo</h3>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="p-1 hover:bg-zinc-800 rounded text-zinc-400"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {isAdding && (
        <div className="mb-4 space-y-2">
          <input
            type="text"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            placeholder="New task..."
            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-sm text-white placeholder-zinc-500"
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
          <div className="flex gap-2">
            {(['high', 'medium', 'low'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setNewTodoPriority(p)}
                className={`px-2 py-1 text-xs rounded capitalize ${
                  newTodoPriority === p
                    ? `${PRIORITY_BG_COLORS[p]} ${PRIORITY_COLORS[p]}`
                    : 'text-zinc-500 hover:bg-zinc-800'
                }`}
              >
                {p === 'high' && <AlertCircle className="w-3 h-3 inline mr-1" />}
                {p === 'medium' && <Clock className="w-3 h-3 inline mr-1" />}
                {p}
              </button>
            ))}
            <button
              onClick={handleAdd}
              className="ml-auto px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
            >
              Add
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2 max-h-48 overflow-y-auto">
        {pendingTodos.length === 0 && completedTodos.length === 0 && (
          <p className="text-sm text-zinc-500 text-center py-4">No todos yet</p>
        )}

        {pendingTodos.map((todo) => (
          <div
            key={todo.id}
            className="flex items-center gap-2 group"
          >
            <button
              onClick={() => toggleTodo(todo.id, todo.is_done || false)}
              className="text-zinc-400 hover:text-zinc-300"
            >
              <Circle className="w-4 h-4" />
            </button>
            <span className="flex-1 text-sm text-zinc-300 truncate">{todo.text}</span>
            <span className={`text-xs ${PRIORITY_COLORS[todo.priority as keyof typeof PRIORITY_COLORS] || 'text-zinc-500'}`}>
              {todo.priority?.charAt(0).toUpperCase()}
            </span>
            <button
              onClick={() => deleteTodo.mutate(todo.id)}
              className="opacity-0 group-hover:opacity-100 p-1 text-zinc-500 hover:text-red-400"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ))}

        {completedTodos.length > 0 && (
          <>
            <div className="border-t border-zinc-800 my-2" />
            {completedTodos.map((todo) => (
              <div
                key={todo.id}
                className="flex items-center gap-2 group opacity-50"
              >
                <button
                  onClick={() => toggleTodo(todo.id, todo.is_done || false)}
                  className="text-green-500"
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>
                <span className="flex-1 text-sm text-zinc-500 line-through truncate">{todo.text}</span>
                <button
                  onClick={() => deleteTodo.mutate(todo.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-zinc-500 hover:text-red-400"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
