'use client'

import { useState, DragEvent } from 'react'

interface Todo {
  id: number
  title: string
  date: string
  priority: 'low' | 'medium' | 'high'
  completed: boolean
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date()
    const dayOfWeek = today.getDay()
    const start = new Date(today)
    start.setDate(today.getDate() - dayOfWeek)
    start.setHours(0, 0, 0, 0)
    return start
  })
  const [draggedTodo, setDraggedTodo] = useState<Todo | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !date) return

    const newTodo: Todo = {
      id: Date.now(),
      title: title.trim(),
      date,
      priority: 'medium',
      completed: false,
    }

    setTodos([...todos, newTodo])
    setTitle('')
    setDate('')
  }

  const formatDateKey = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  }

  const getWeekDays = () => {
    const days = []
    for (let i = 0; i < 7; i++) {
      const day = new Date(currentWeekStart)
      day.setDate(currentWeekStart.getDate() + i)
      days.push(day)
    }
    return days
  }

  const weekDays = getWeekDays()
  const today = new Date()
  const todayKey = formatDateKey(today)

  const navigateWeek = (delta: number) => {
    const newStart = new Date(currentWeekStart)
    newStart.setDate(currentWeekStart.getDate() + delta * 7)
    setCurrentWeekStart(newStart)
  }

  const goToToday = () => {
    const today = new Date()
    const dayOfWeek = today.getDay()
    const start = new Date(today)
    start.setDate(today.getDate() - dayOfWeek)
    start.setHours(0, 0, 0, 0)
    setCurrentWeekStart(start)
  }

  const setPriority = (todoId: number, priority: Todo['priority']) => {
    setTodos(todos.map(todo =>
      todo.id === todoId ? { ...todo, priority } : todo
    ))
  }

  const toggleComplete = (todoId: number) => {
    setTodos(todos.map(todo =>
      todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const moveTodoToDate = (todoId: number, newDate: string) => {
    setTodos(todos.map(todo =>
      todo.id === todoId ? { ...todo, date: newDate } : todo
    ))
  }

  const handleDragStart = (e: DragEvent<HTMLDivElement>, todo: Todo) => {
    setDraggedTodo(todo)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>, dateKey: string) => {
    e.preventDefault()
    if (draggedTodo) {
      moveTodoToDate(draggedTodo.id, dateKey)
      setDraggedTodo(null)
    }
  }

  const handleDragEnd = () => {
    setDraggedTodo(null)
  }

  const priorityColors = {
    high: { bg: '#fee2e2', border: '#ef4444', text: '#dc2626' },
    medium: { bg: '#fef3c7', border: '#f59e0b', text: '#d97706' },
    low: { bg: '#dcfce7', border: '#22c55e', text: '#16a34a' },
  }

  const todosByDate = todos.reduce<Record<string, Todo[]>>((acc, todo) => {
    if (!acc[todo.date]) {
      acc[todo.date] = []
    }
    acc[todo.date].push(todo)
    return acc
  }, {})

  const formatWeekRange = () => {
    const endOfWeek = new Date(currentWeekStart)
    endOfWeek.setDate(currentWeekStart.getDate() + 6)
    const startMonth = currentWeekStart.toLocaleString('default', { month: 'short' })
    const endMonth = endOfWeek.toLocaleString('default', { month: 'short' })
    const startDay = currentWeekStart.getDate()
    const endDay = endOfWeek.getDate()
    const year = currentWeekStart.getFullYear()

    if (startMonth === endMonth) {
      return `${startMonth} ${startDay} - ${endDay}, ${year}`
    }
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`
  }

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  return (
    <main style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '24px',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        <header style={{
          textAlign: 'center',
          marginBottom: '24px',
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            color: '#fff',
            margin: '0 0 8px 0',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}>
            Weekly Planner
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.8)',
            margin: 0,
            fontSize: '1.1rem',
          }}>
            Drag and drop tasks to organize your week
          </p>
        </header>

        <form onSubmit={handleSubmit} style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '24px',
          padding: '20px',
          backgroundColor: 'rgba(255,255,255,0.95)',
          borderRadius: '16px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
          flexWrap: 'wrap',
        }}>
          <input
            type="text"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              flex: '1 1 200px',
              padding: '14px 18px',
              fontSize: '16px',
              border: '2px solid #e5e7eb',
              borderRadius: '10px',
              outline: 'none',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#667eea'
              e.target.style.boxShadow = '0 0 0 3px rgba(102,126,234,0.1)'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e5e7eb'
              e.target.style.boxShadow = 'none'
            }}
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{
              padding: '14px 18px',
              fontSize: '16px',
              border: '2px solid #e5e7eb',
              borderRadius: '10px',
              outline: 'none',
              cursor: 'pointer',
            }}
          />
          <button
            type="submit"
            style={{
              padding: '14px 28px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(102,126,234,0.4)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            Add Task
          </button>
        </form>

        <div style={{
          backgroundColor: 'rgba(255,255,255,0.95)',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          overflow: 'hidden',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '20px 24px',
            borderBottom: '1px solid #e5e7eb',
            background: 'linear-gradient(to right, #f8fafc, #f1f5f9)',
          }}>
            <button
              onClick={() => navigateWeek(-1)}
              style={{
                padding: '10px 20px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                backgroundColor: '#fff',
                border: '2px solid #e5e7eb',
                borderRadius: '10px',
                color: '#374151',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#667eea'
                e.currentTarget.style.color = '#667eea'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb'
                e.currentTarget.style.color = '#374151'
              }}
            >
              Previous
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <h2 style={{
                margin: 0,
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#1f2937',
              }}>
                {formatWeekRange()}
              </h2>
              <button
                onClick={goToToday}
                style={{
                  padding: '8px 16px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                }}
              >
                Today
              </button>
            </div>
            <button
              onClick={() => navigateWeek(1)}
              style={{
                padding: '10px 20px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                backgroundColor: '#fff',
                border: '2px solid #e5e7eb',
                borderRadius: '10px',
                color: '#374151',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#667eea'
                e.currentTarget.style.color = '#667eea'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb'
                e.currentTarget.style.color = '#374151'
              }}
            >
              Next
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
          }}>
            {weekDays.map((day, index) => {
              const dateKey = formatDateKey(day)
              const isToday = dateKey === todayKey
              const dayTodos = todosByDate[dateKey] || []
              const isWeekend = index === 0 || index === 6

              return (
                <div
                  key={dateKey}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, dateKey)}
                  style={{
                    minHeight: '280px',
                    borderRight: index < 6 ? '1px solid #e5e7eb' : 'none',
                    backgroundColor: isToday ? '#f0f7ff' : isWeekend ? '#fafafa' : '#fff',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'background-color 0.2s',
                  }}
                >
                  <div style={{
                    padding: '16px 12px',
                    borderBottom: '1px solid #e5e7eb',
                    textAlign: 'center',
                    backgroundColor: isToday ? '#667eea' : 'transparent',
                  }}>
                    <div style={{
                      fontSize: '12px',
                      fontWeight: '600',
                      color: isToday ? 'rgba(255,255,255,0.8)' : '#6b7280',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: '4px',
                    }}>
                      {dayNames[index].slice(0, 3)}
                    </div>
                    <div style={{
                      fontSize: '1.75rem',
                      fontWeight: '700',
                      color: isToday ? '#fff' : '#1f2937',
                    }}>
                      {day.getDate()}
                    </div>
                  </div>

                  <div style={{
                    flex: 1,
                    padding: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    overflowY: 'auto',
                  }}>
                    {dayTodos.map((todo) => (
                      <div
                        key={todo.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, todo)}
                        onDragEnd={handleDragEnd}
                        style={{
                          padding: '10px',
                          backgroundColor: todo.completed ? '#f3f4f6' : priorityColors[todo.priority].bg,
                          borderLeft: `4px solid ${todo.completed ? '#9ca3af' : priorityColors[todo.priority].border}`,
                          borderRadius: '8px',
                          cursor: 'grab',
                          transition: 'all 0.2s',
                          opacity: draggedTodo?.id === todo.id ? 0.5 : 1,
                          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.02)'
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)'
                          e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)'
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '8px',
                        }}>
                          <input
                            type="checkbox"
                            checked={todo.completed}
                            onChange={() => toggleComplete(todo.id)}
                            style={{
                              width: '16px',
                              height: '16px',
                              cursor: 'pointer',
                              accentColor: '#667eea',
                              marginTop: '2px',
                            }}
                          />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                              fontSize: '13px',
                              fontWeight: '500',
                              color: todo.completed ? '#9ca3af' : '#374151',
                              textDecoration: todo.completed ? 'line-through' : 'none',
                              wordBreak: 'break-word',
                              lineHeight: '1.4',
                            }}>
                              {todo.title}
                            </div>
                            <select
                              value={todo.priority}
                              onChange={(e) => setPriority(todo.id, e.target.value as Todo['priority'])}
                              onClick={(e) => e.stopPropagation()}
                              style={{
                                marginTop: '6px',
                                padding: '3px 6px',
                                fontSize: '11px',
                                fontWeight: '600',
                                borderRadius: '4px',
                                border: 'none',
                                backgroundColor: todo.completed ? '#e5e7eb' : priorityColors[todo.priority].border,
                                color: '#fff',
                                cursor: 'pointer',
                                textTransform: 'uppercase',
                              }}
                            >
                              <option value="high">High</option>
                              <option value="medium">Medium</option>
                              <option value="low">Low</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <footer style={{
          textAlign: 'center',
          marginTop: '24px',
          color: 'rgba(255,255,255,0.7)',
          fontSize: '14px',
        }}>
          Tip: Drag tasks between days to reschedule them
        </footer>
      </div>
    </main>
  )
}
