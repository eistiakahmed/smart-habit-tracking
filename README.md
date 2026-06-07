# Smart Habit Tracker - Frontend

A minimal, beautiful 30-day habit tracker built with Next.js, Tailwind CSS, and Recharts.

## Features

- **30-Day Habit Grid**: Track habits across 30 days organized into 4 weeks
- **Top Habits Summary**: View your most consistent habits at a glance
- **Weekly Progress Charts**: Visual bar charts showing weekly completion rates
- **Overall Progress Dashboard**: Comprehensive progress overview with pie charts
- **Optimistic UI Updates**: Instant feedback when toggling habits
- **Real-time Statistics**: Current streak, longest streak, completion rates
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Minimalistic UI**: Clean, light interface with soft week colors

## Tech Stack

- **Framework**: Next.js 16.2.4 (App Router)
- **Styling**: Tailwind CSS 4
- **Charts**: Recharts 3.8
- **Language**: TypeScript 5
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm installed

### Installation

```bash
cd frontend
pnpm install
```

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_USE_MOCK_DATA=false
```

### Run Development Server

```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
pnpm run build
pnpm start
```

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── globals.css       # Global styles
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Main page
│   ├── components/
│   │   ├── DayCheckbox.tsx   # Individual day checkbox
│   │   ├── HabitRow.tsx      # Single habit row
│   │   ├── HabitGrid.tsx     # Main habit grid
│   │   ├── ProgressBar.tsx   # Progress bar component
│   │   ├── TopHabits.tsx     # Top habits summary
│   │   ├── WeeklyChart.tsx   # Weekly bar chart
│   │   └── OverallProgress.tsx  # Overall progress dashboard
│   ├── lib/
│   │   ├── api.ts            # API client
│   │   ├── utils.ts          # Utility functions
│   │   └── mockData.ts       # Mock data for testing
│   └── types/
│       └── index.ts          # TypeScript types
```

## Components

### DayCheckbox
Interactive checkbox for individual days with:
- Smooth scale animations
- Week-specific colors
- Hover tooltips
- Toggle functionality

### HabitRow
Displays a single habit with:
- Sticky habit name
- 30-day checkbox grid
- Progress percentage
- Week color coding

### HabitGrid
Main grid component featuring:
- Weekly header with color labels
- Multiple habit rows
- Scrollable container
- Loading and empty states

### TopHabits
Summary card showing:
- Top 5 most consistent habits
- Individual progress bars
- Streak indicators with fire emoji
- Category labels

### WeeklyChart
Bar chart displaying:
- Weekly completion rates
- Hover tooltips
- Smooth animations
- Responsive design

### OverallProgress
Dashboard with:
- Pie chart for completed vs remaining
- Key statistics cards
- Overall progress bar
- Total completion percentage

## API Integration

The frontend integrates with the backend API through:

```typescript
// Get all habits
await api.getHabits({ isActive: true, limit: 20 });

// Toggle habit completion
await api.toggleHabit(habitId);

// Get habit progress
await api.getHabitProgress(habitId);
```

## Design Principles

### Week Color Coding
- Week 1: Blue (#3B82F6)
- Week 2: Orange (#F97316)
- Week 3: Green (#10B981)
- Week 4: Purple (#8B5CF6)

### Progress Colors
- 80%+: Green
- 50-79%: Amber
- 25-49%: Orange
- <25%: Red

### Minimalistic Design
- Light background (#f8f9fb)
- Soft shadows
- Rounded corners (xl)
- Smooth transitions
- Clean typography

## Mock Data

For development without the backend, set:
```env
NEXT_PUBLIC_USE_MOCK_DATA=true
```

This loads sample habits with realistic progress data.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT
