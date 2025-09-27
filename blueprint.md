# SwipeHire AI

## Overview

SwipeHire AI is a web application that helps users prepare for job interviews. It provides AI-powered mock interviews, personalized feedback, and a dashboard for interviewers to review candidate results.

## Project Outline

### 1. Design System & Theming

*   **Theme Provider**: Use `next-themes` to allow switching between light and dark modes, defaulting to the user's system preference.
*   **Theme Toggle**: A sun/moon icon button in the top-right corner of the main layout.
*   **Color Palette (Tailwind CSS)**:
    *   **Light Mode**:
        *   `background`: `slate-50`
        *   `foreground`: `slate-900`
        *   `card`: `white`
        *   `primary`: `sky-600`
        *   `primary-foreground`: `white`
        *   `destructive`: `red-500`
    *   **Dark Mode**:
        *   `background`: `slate-950`
        *   `foreground`: `slate-200`
        *   `card`: `slate-900`
        *   `primary`: `sky-500`
        *   `primary-foreground`: `slate-950`
        *   `destructive`: `red-600`
*   **Typography**: "Inter" font will be used throughout the application.
*   **Layout & Spacing**: Consistent spacing, `rounded-lg` corners, and a centered main content area (`max-w-screen-xl`).

### 2. Main Application Layout (`/app/layout.tsx`)

*   Root layout with the specified background color.
*   Includes the `ThemeProvider`.
*   A header with the title "SwipeHire AI" and the theme toggle button.
*   A centered main content area below the header.

### 3. Core Application Shell (`/app/page.tsx`)

*   A two-tab interface using `Tabs` from `shadcn/ui`.
*   **Tab 1**: "Interviewee" (`value="interviewee"`)
*   **Tab 2**: "Interviewer" (`value="interviewer"`)

### 4. "Interviewee" Tab

*   Manages three states: `not-started`, `in-progress`, `completed`.
*   **State 1: `not-started`**:
    *   A `Card` prompts the user to upload a resume (PDF or DOCX).
    *   An interactive file upload zone.
    *   A "Start Interview" button, disabled until a file is selected.
*   **State 2: `in-progress`**:
    *   A chat interface showing the current question number.
    *   A scrollable area for the conversation (AI questions on the left, user answers on the right).
    *   An input area with a timer, a `Textarea` for the answer, and a "Submit Answer" button.
*   **State 3: `completed`**:
    *   A `Card` displaying the final score and an AI-generated summary.
    *   A "Take New Interview" button to reset the state.

### 5. "Interviewer" Tab (Candidate Dashboard)

*   A header with the title "Candidate Dashboard" and a search input.
*   A `Table` displaying candidate results with columns for "Candidate", "Score", "Summary", and "Actions".
*   Badges for scores (green, yellow, red).
*   An empty state message if no interviews are completed.

### 6. Modals (`Dialog`)

*   **Candidate Details Modal**: Shows the full chat history for a selected candidate.
*   **Welcome Back Modal**: Prompts users to resume an in-progress interview.
*   **Error Modal**: A generic modal for displaying error messages.

## Current Plan

I will now begin implementing the design system and theming.
