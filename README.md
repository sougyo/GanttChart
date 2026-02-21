# Gantt Chart Tool

A browser-based Gantt chart tool built as a single HTML file. No server required — just open `index.html` locally or visit the hosted version.

## Usage

Visit https://sougyo.github.io/GanttChart/ or open `index.html` in your browser.

<img src="doc/sample.gif" alt="sample">

## Features

### General

- **Edit / View mode** toggle
- **Time unit** switching: Month, Week, or Day (default: Month)
  - Day unit shows day of week and highlights weekends and holidays
- **Font size** adjustment (A- / A+ buttons) — applies to the chart table only, not the toolbar
- **Fit Width** button — adjusts column width so all columns fit the current screen width
- **Export / Import** project data as JSON (filename: `YYYYMMDD-hhmmss.json`)
- **Auto-save** — select a file once; the chart is automatically saved to it after every change (requires Chrome/Edge with File System Access API)
- **Multi-language support**: English (default) and Japanese, switchable via toolbar selector
- **Resizable sidebar**: drag the border between the task name column and the date columns to adjust width
- **Resizable table height**: drag the bottom edge of the chart to resize vertically
- **Top scrollbar**: horizontal scroll control placed above the chart header for easy access
- **Editable corner label**: click the top-left cell to customize the column header (e.g. "Task", "Phase")
- **Undo** (Ctrl+Z) for edit operations

### Edit Mode

- **Right-click** on a row's date area to add tasks, milestones, or progress points
- **Double-click** a task or milestone label for inline editing
- **Right-click a task/milestone** for a detail dialog to edit dates, label, color, label position, shape, memo, etc.
- **Drag** task bars to move them; **drag edges** to resize
- **Ctrl+Click** for multi-select, then drag to move multiple items together
- **Delete / Backspace** to remove selected items
- **Click** task names in the sidebar to edit directly
- **Add / remove columns** from either end of the timeline
- **Add rows** and **drag to reorder** them (☰ handle)
- **Visibility toggle** per row (👁 icon) — controls whether the row appears in View mode
- **Row settings** (right-click row): edit name, assign row color, add a memo, add/remove lanes, collapse/expand

### Tasks (Bars)

- Rectangular bars representing a time period
- **Label positions**: inside, above, below, left, or right of the bar
- **10 color options** available
- **Tooltip** shows the start date, end date, and **business day count** (weekends and holidays excluded)
- **Progress shading**: the left portion of each task bar is shaded up to the row's progress point

### Milestones

- Placed on a specific date; represented by a marker (▽, ▼, △, or ▲)
- **Custom color** per milestone
- **Label position**: before the marker (label left, marker right) or after (marker left, label right)
- The marker is always positioned at the right edge of the specified date's column

### Arrows

- In Edit mode, hover over a task or milestone to reveal **anchor dots**
- **Drag from an anchor dot** to another item to draw a directional arrow
- Arrows from a task's right edge to a milestone on the same date are drawn **vertically**
- **Right-click** an arrow to delete it
- **Toggle visibility** with the Arrows checkbox in the toolbar

### Multi-Lane Rows

- Each row can have **multiple lanes** (sub-rows) for overlapping items
- Add/remove lanes via the row's right-click context menu
- Items are assigned to a specific lane; lanes are separated by dashed lines

### Progress Line

- Set a **base date** (default: today)
- Place progress points on each row by right-clicking; connected by a red polyline
- Rows without explicit points use the base date
- Points are **draggable** with the mouse
- Toggle visibility with a checkbox
- **Progress Shading** checkbox: shades the completed portion of each task bar
- **Reset All** button to clear all explicit progress points at once

### Date Range

- Set **start / end date** inputs in the toolbar to filter the visible period
- **Drag across the header** to select a range interactively
- **All** button to clear the range filter
- In View mode, columns auto-fit to the filtered range width

### Holidays

- Open the **Holidays** dialog from the toolbar to manage a holiday list
- Each entry has a **date** and a **name** (reason)
- Add or delete holidays freely
- In **Day unit** view, holidays are highlighted with the same color as weekends
- Business day counts in task tooltips automatically exclude registered holidays

### View Mode

- Presentation-quality rendering without edit controls
- **Date range** filter with auto-fit column width
- **Copy Image** button to copy the chart as PNG to the clipboard (or downloads the file if clipboard access is unavailable)
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
  "bodyHeight": null,
  "viewRange": { "start": "2026-03-01", "end": "2026-06-30" },
  "rows": [
    {
      "name": "Task name",
      "visible": true,
      "lanes": 2,
      "color": null,
      "memo": "",
      "collapsed": false,
      "items": [
        {
          "type": "task",
          "startDate": "2026-02-01",
          "endDate": "2026-04-30",
          "label": "Development",
          "color": "#4CAF50",
          "taskLabelPosition": "inside",
          "lane": 0
        },
        {
          "type": "milestone",
          "date": "2026-05-15",
          "label": "Release",
          "labelPosition": "after",
          "milestoneShape": "▽",
          "milestoneColor": "#d32f2f",
          "lane": 0
        }
      ]
    }
  ],
  "thunderLine": {
    "visible": true,
    "defaultDate": "2026-02-15",
    "points": [
      { "rowIndex": 0, "lane": 0, "date": "2026-03-10" }
    ]
  },
  "arrowsVisible": true,
  "arrows": [
    {
      "from": { "rowIndex": 0, "itemIndex": 0, "edge": "right" },
      "to":   { "rowIndex": 0, "itemIndex": 1, "edge": "center" }
    }
  ],
  "progressShading": false,
  "holidays": [
    { "date": "2026-01-01", "name": "New Year's Day" }
  ]
}
```

## License

Copyright 2026 Shogo Matsumoto

Licensed under the Apache License 2.0. See the [LICENSE](LICENSE) file for details.
