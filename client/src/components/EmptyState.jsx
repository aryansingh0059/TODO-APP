export default function EmptyState({ filter }) {
  const messages = {
    all: { title: 'No todos yet', sub: 'Create your first todo to get started.' },
    active: { title: 'No active todos', sub: 'All tasks are completed — great work!' },
    completed: { title: 'No completed todos', sub: 'Complete a task and it will appear here.' },
  }
  const { title, sub } = messages[filter] || messages.all

  return (
    <div className="empty-state">
      <p className="empty-title">{title}</p>
      <p>{sub}</p>
    </div>
  )
}
