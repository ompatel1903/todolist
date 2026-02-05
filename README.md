# Weekly Planner

A drag-and-drop weekly task planner built with Next.js and React.

## Features

- **Weekly Calendar View** - See your entire week at a glance
- **Drag & Drop** - Easily reschedule tasks by dragging them between days
- **Priority Levels** - Mark tasks as high, medium, or low priority with color coding
- **Task Completion** - Check off tasks as you complete them
- **Week Navigation** - Browse past and future weeks
- **Today Highlight** - Current day is highlighted for quick reference

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/todo-calendar.git
cd todo-calendar

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Add a Task** - Enter a task name, select a date, and click "Add Task"
2. **Change Priority** - Click the priority dropdown on any task to change it
3. **Complete a Task** - Check the checkbox to mark a task as done
4. **Reschedule** - Drag and drop tasks to move them to different days
5. **Navigate Weeks** - Use Previous/Next buttons or click "Today" to jump back

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [React](https://reactjs.org/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety

## Project Structure

```
todo-calendar/
├── app/
│   ├── layout.tsx    # App layout
│   └── page.tsx      # Main planner component
├── package.json
└── README.md
```

## License

MIT
