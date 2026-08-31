import { useState, useEffect } from 'react'

const EMPTY_FORM = {
  title: '',
  description: '',
  priority: 'medium',
  dueDate: '',
}

export default function TodoForm({ initialData, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [fieldError, setFieldError] = useState('')

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        description: initialData.description || '',
        priority: initialData.priority || 'medium',
        dueDate: initialData.dueDate
          ? initialData.dueDate.slice(0, 10)
          : '',
      })
    } else {
      setForm(EMPTY_FORM)
    }
    setFieldError('')
  }, [initialData])

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (name === 'title' && fieldError) setFieldError('')
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim()) {
      setFieldError('Title is required')
      return
    }
    onSubmit({
      title: form.title.trim(),
      description: form.description.trim(),
      priority: form.priority,
      dueDate: form.dueDate || null,
    })
  }

  const isEditing = Boolean(initialData)

  return (
    <form onSubmit={handleSubmit} noValidate aria-label={isEditing ? 'Edit todo form' : 'Create todo form'}>
      <div className="form-group">
        <label htmlFor="todo-title" className="label-required">
          Title
        </label>
        <input
          id="todo-title"
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="What needs to be done?"
          maxLength={200}
          aria-describedby={fieldError ? 'title-error' : undefined}
          aria-invalid={Boolean(fieldError)}
          autoFocus
        />
        {fieldError && (
          <span id="title-error" className="field-error" role="alert">
            {fieldError}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="todo-description">Description</label>
        <textarea
          id="todo-description"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Add more details (optional)…"
          rows={3}
          maxLength={1000}
        />
      </div>

      <div className="form-group">
        <label htmlFor="todo-priority">Priority</label>
        <select
          id="todo-priority"
          name="priority"
          value={form.priority}
          onChange={handleChange}
        >
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="todo-dueDate">Due date</label>
        <input
          id="todo-dueDate"
          type="date"
          name="dueDate"
          value={form.dueDate}
          onChange={handleChange}
        />
      </div>

      <div className="modal-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Saving…' : isEditing ? 'Save changes' : 'Create todo'}
        </button>
      </div>
    </form>
  )
}
