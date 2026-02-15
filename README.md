# Gantt Chart Tool

A browser-based Gantt chart tool built as a single HTML file. No server required — just open `index.html` locally or visit the hosted version.

## Usage

Visit https://sougyo.github.io/GanttChart/ or open `index.html` in your browser.

<img src="doc/sample.gif" alt="sample">

## Features

### General

- **Edit / View mode** toggle
- **Time unit** switching: Month, Week, or Day (default: Month)
- **Font size** adjustment (A- / A+ buttons)
- **Export / Import** project data as JSON (filename: `YYYYMMDD-hhmmss.json`)
- **Multi-language support**: English (default) and Japanese, switchable via toolbar selector
- **Resizable sidebar**: drag the border between the task name column and the date columns to adjust width
- **Task name wrapping**: long task names wrap within the sidebar; use Shift+Enter for explicit line breaks
- **Editable corner label**: click the top-left cell to customize the column header (e.g. "Task", "Phase")

### Edit Mode

- Right-click to add **tasks** (bars) or **milestones** (▽ markers)
- **Double-click** a task or milestone label for inline editing
- Right-click for a **detail dialog** to edit dates, color, label position, etc.
- **Drag** task bars to move them; **drag edges** to resize
- **Ctrl+Click** for multi-select, then drag to move together
- **Delete / Backspace** to remove selected items
- Click task names in the sidebar to edit directly
- Add/remove columns (from either end) and rows
- **Drag to reorder** rows (☰ handle)
- **Visibility toggle** per row (👁 icon) — controls whether the row appears in View mode

### Milestones

- Represented by a **▽** marker on a specific date
- Label can be placed before or after the marker

### Tasks (Bars)

- Rectangular bars representing a time period
- Label displayed inside, above, below, left, or right of the bar
- 10 color options available
- Date-aware positioning (dates are preserved when columns are added/removed)

### Progress Line

- Set a **base date** (default: today)
- Place progress points on each row, connected by a red polyline
- Rows without explicit points default to the base date position
- The line zigzags between each row's progress point and the base date at row boundaries
- Points are **draggable** with the mouse
- Toggle visibility with a checkbox
- **Reset All** button to clear all progress points at once

### View Mode

- Presentation-quality rendering
- **Date range** filter to display a specific period (columns auto-fit to width)
- **Copy Image** button to copy the chart as PNG to the clipboard
- Rows marked as hidden in Edit mode are excluded

## Tech Stack

- HTML / CSS / JavaScript (Vanilla)
- No external dependencies
- Single file (`index.html`)

## Data Format

Exported JSON structure:

```json
{
  "lang": "en",
  "timeUnit": "month",
  "startDate": "2026-01-01",
  "endDate": "2026-12-31",
  "fontSize": 14,
  "cornerLabel": "",
  "sidebarWidth": 180,
  "colWidth": null,
  "viewRange": null,
  "rows": [
    {
      "name": "Task name",
      "visible": true,
      "items": [
        {
          "type": "task",
          "startDate": "2026-02-01",
          "endDate": "2026-04-30",
          "label": "Development",
          "color": "#4CAF50",
          "taskLabelPosition": "inside"
        },
        {
          "type": "milestone",
          "date": "2026-05-15",
          "label": "Release",
          "labelPosition": "after"
        }
      ]
    }
  ],
  "thunderLine": {
    "visible": true,
    "defaultDate": "2026-02-15",
    "points": [
      { "rowIndex": 0, "date": "2026-03-10" }
    ]
  }
}
```

## License

Copyright 2026 Shogo Matsumoto

Licensed under the Apache License 2.0. See the [LICENSE](LICENSE) file for details.
