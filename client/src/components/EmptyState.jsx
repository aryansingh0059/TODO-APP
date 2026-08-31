export default function EmptyState({ view = 'todos', filter = 'all' }) {
  const viewMessages = {
    todos: { title: 'No todos yet', sub: 'Create your first todo to get started.' },
    active: { title: 'No active tasks', sub: 'All your tasks are completed.' },
    today: { title: 'Nothing due today', sub: "You're all caught up for today." },
    upcoming: { title: 'No upcoming tasks', sub: 'You have nothing scheduled for later.' },
  }

  const filterMessages = {
    active: { title: 'No active todos', sub: 'All tasks are completed.' },
    completed: { title: 'No completed todos', sub: 'Complete a task and it will appear here.' },
  }

  const { title, sub } = (filter !== 'all' && filterMessages[filter])
    ? filterMessages[filter]
    : (viewMessages[view] || viewMessages.todos)

  return (
    <div className="empty-state">
      <p className="empty-title">{title}</p>
      <p>{sub}</p>
    </div>
  )
}
