import React, { useEffect, useRef, useState } from 'react'

export default function ToDo() {
  const [tasks, setTasks] = useState(() => {
    try { return JSON.parse(localStorage.getItem('todo.v2') || '[]') } catch { return [] }
  })
  const [text, setText] = useState('')
  const [editId, setEditId] = useState(null)
  const ref = useRef(null)

  useEffect(() => localStorage.setItem('todo.v2', JSON.stringify(tasks)), [tasks])
  useEffect(() => ref.current?.focus(), [editId])

  const uid = () => Date.now().toString(36)

  const submit = e => {
    e?.preventDefault()
    const v = text.trim()
    if (!v) return
    if (editId) {
      setTasks(t => t.map(x => x.id === editId ? { ...x, text: v } : x))
      setEditId(null)
    } else {
      setTasks(t => [{ id: uid(), text: v, completed: false, createdAt: Date.now() }, ...t])
    }
    setText('')
    ref.current?.focus()
  }

  const toggle = id => setTasks(t => t.map(x => x.id === id ? { ...x, completed: !x.completed } : x))
  const remove = id => setTasks(t => t.filter(x => x.id !== id))
  const edit = id => { const item = tasks.find(x => x.id === id); if (!item) return; setEditId(id); setText(item.text) }
  const clearDone = () => setTasks(t => t.filter(x => !x.completed))
  const clearAll = () => { if (!confirm('همه تسک‌ها حذف شوند؟')) return; setTasks([]) }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-6" dir="rtl">
      <div className="w-full max-w-lg bg-white/95 rounded-2xl shadow-lg p-5">
        <header className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">🌿 لیست کارها</h1>
          
          </div>
          <div className="flex gap-2">
            <button onClick={clearDone} className="px-2 py-1 rounded border text-sm">پاک‌شده‌ها</button>
            <button onClick={clearAll} className="px-2 py-1 rounded bg-red-50 text-red-600 text-sm">پاک‌کردن</button>
          </div>
        </header>

        <form onSubmit={submit} className="flex gap-3 mb-4">
          <input
            ref={ref}
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder={editId ? 'ویرایش و Enter' : 'تسک جدید و Enter'}
            className="flex-1 rounded-full border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
          <button type="submit" className="px-4 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm">
            {editId ? 'بروزرسانی' : 'افزودن'}
          </button>
        </form>

        <main>
          {!tasks.length ? (
            <div className="text-center text-gray-400 py-8">لیست خالی — اولین تسک را اضافه کنید.</div>
          ) : (
            <ul className="space-y-3">
              {tasks.map(t => (
                <li key={t.id} className="flex items-center justify-between p-3 rounded-xl border hover:shadow transition-shadow">
                  <div className="flex items-center gap-3 min-w-0">
                    <button onClick={() => toggle(t.id)} className={`w-9 h-9 rounded-lg border flex items-center justify-center ${t.completed ? 'bg-green-100' : ''}`}>
                      {t.completed ? '✓' : '○'}
                    </button>

                    <div className="min-w-0">
                      <div className={`truncate ${t.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>{t.text}</div>
                      <div className="text-xs text-gray-400 mt-1">{new Date(t.createdAt).toLocaleString('fa-IR')}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button onClick={() => edit(t.id)} className="px-2 py-1 rounded border text-sm">ویرایش</button>
                    <button onClick={() => remove(t.id)} className="px-2 py-1 rounded bg-red-50 text-red-600 text-sm">حذف</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </main>

        <footer className="mt-4 text-sm text-gray-500 flex justify-between">
          <div>{tasks.filter(t => !t.completed).length} مانده</div>
        
        </footer>
      </div>
    </div>
  )
}
