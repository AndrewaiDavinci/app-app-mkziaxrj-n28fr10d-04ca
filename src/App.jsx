import { useState, useEffect } from 'react'
import { Plus, Check, Trash2, Circle, CheckCircle2 } from 'lucide-react'
import { cn } from './lib/utils'

function App() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('todos')
    return saved ? JSON.parse(saved) : []
  })
  const [input, setInput] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const addTodo = (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const newTodo = {
      id: Date.now(),
      text: input.trim(),
      completed: false,
      createdAt: new Date().toISOString()
    }

    setTodos(prev => [newTodo, ...prev])
    setInput('')
  }

  const toggleTodo = (id) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id))
  }

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  const stats = {
    total: todos.length,
    active: todos.filter(t => !t.completed).length,
    completed: todos.filter(t => t.completed).length
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8 animate-in fade-in slide-in-from-top duration-500">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#ec4899] bg-clip-text text-transparent mb-2">
            할 일 관리
          </h1>
          <p className="text-gray-600">오늘 해야 할 일들을 관리하세요</p>
        </div>

        {/* Input Form */}
        <form 
          onSubmit={addTodo}
          className="mb-6 animate-in fade-in slide-in-from-top duration-500 delay-100"
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="새로운 할 일을 입력하세요..."
              className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20 outline-none transition-all duration-200 bg-white/80 backdrop-blur-sm"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white rounded-xl font-medium hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              추가
            </button>
          </div>
        </form>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6 animate-in fade-in slide-in-from-top duration-500 delay-200">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="text-2xl font-bold text-[#6366f1]">{stats.total}</div>
            <div className="text-sm text-gray-600">전체</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="text-2xl font-bold text-[#8b5cf6]">{stats.active}</div>
            <div className="text-sm text-gray-600">진행중</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="text-2xl font-bold text-[#ec4899]">{stats.completed}</div>
            <div className="text-sm text-gray-600">완료</div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-6 animate-in fade-in slide-in-from-top duration-500 delay-300">
          {[
            { key: 'all', label: '전체' },
            { key: 'active', label: '진행중' },
            { key: 'completed', label: '완료' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={cn(
                "px-6 py-2 rounded-lg font-medium transition-all duration-200",
                filter === key
                  ? "bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white shadow-md"
                  : "bg-white/60 text-gray-700 hover:bg-white/80"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Todo List */}
        <div className="space-y-2">
          {filteredTodos.length === 0 ? (
            <div className="text-center py-12 animate-in fade-in duration-500">
              <Circle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {filter === 'all' && '아직 할 일이 없습니다'}
                {filter === 'active' && '진행중인 할 일이 없습니다'}
                {filter === 'completed' && '완료된 할 일이 없습니다'}
              </p>
            </div>
          ) : (
            filteredTodos.map((todo, index) => (
              <div
                key={todo.id}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 group animate-in fade-in slide-in-from-bottom"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className={cn(
                      "flex-shrink-0 w-6 h-6 rounded-full border-2 transition-all duration-200 flex items-center justify-center",
                      todo.completed
                        ? "bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] border-transparent"
                        : "border-gray-300 hover:border-[#6366f1]"
                    )}
                  >
                    {todo.completed && (
                      <Check className="w-4 h-4 text-white" />
                    )}
                  </button>

                  <span
                    className={cn(
                      "flex-1 transition-all duration-200",
                      todo.completed
                        ? "line-through text-gray-400"
                        : "text-gray-800"
                    )}
                  >
                    {todo.text}
                  </span>

                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {todos.length > 0 && (
          <div className="mt-8 text-center text-sm text-gray-500 animate-in fade-in duration-500 delay-500">
            {stats.completed > 0 && (
              <p>
                {stats.completed}개의 할 일을 완료했습니다! 🎉
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default App