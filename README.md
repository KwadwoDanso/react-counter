# Advanced Counter Lab

A React  + TypeScript counter application demonstrating useState and useEffect with history tracking, auto-save to localStorage, keyboard shortcuts, a reset mechanism, and a custom step input.

## Table of contents

- [Overview](#overview)
  - [Links](#links)
- [How to Run](#how-to-run)
- [Features](#features)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
- [Reflections](#reflections)
- [Author](#author)
- [Acknowledgments](#acknowledgments)

## Overview

An advanced counter that goes beyond basic increment/decrement by tracking every value change in a history array, auto-saving to localStorage with debounced writes, responding to keyboard events with proper cleanup, and allowing users to set a custom step value. The entire app lives in a single component to keep things focused on hooks rather than component architecture.

### Links

- Solution URL: (https://github.com/KwadwoDanso/react-counter.git)

## How to Run

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## Features

- Increment and decrement the count using buttons or ArrowUp/ArrowDown keyboard keys
- Custom step input that controls how much the count changes per action
- Full history of every count value displayed as a comma-separated list
- Auto-save to localStorage with a 300ms debounce and cleanup to prevent race conditions
- On page refresh the saved count loads back from localStorage automatically
- Reset button clears the count back to 0 and wipes the history
- Count text color changes dynamically: green when positive, red when negative, gray at zero

## My process

- Started by setting up the core counter with useState for count, history, and step. Used lazy initialization (useState(() => { ... })) to read the saved count from localStorage only on the first render.
- Added the history tracking effect next. Every time count changes, the effect pushes the new value onto the history array using a functional update (setHistory(prev => [...prev, count])).
- Added the auto-save effect with a 300ms setTimeout. The cleanup function calls clearTimeout so if the user clicks rapidly, only the final value gets saved rather than every intermediate value. This prevents the race condition the lab mentions.
- Added the keyboard listener effect. It attaches a keydown event listener to the document and removes it in the cleanup function. The dependency array includes step so the listener gets re-attached with the current step value whenever the user changes it.
- Added the step input and reset button last since they were the simplest pieces.
- Tested by uncommenting console.log calls at key points during development. All testing logs are commented out in the final code.

### Built with

- React  with functional components and hooks
- TypeScript with strict mode and verbatimModuleSyntax
- Vite as the build tool and dev server
- useState for count, history, step state
- useEffect for history tracking, auto-save, and keyboard listeners
- localStorage for data persistence
- Inline styles with JavaScript objects

### What I learned

- How to use lazy initialization with useState(() => { ... }) so that localStorage is only read once on mount, not on every re-render. Without the function form, localStorage.getItem would run every single render even though the result gets ignored after the first one.
- How functional updates (setCount(prev => prev + step)) guarantee the latest state value. When React batches multiple updates together, using the count variable directly could give a stale value, but the prev callback always receives the most recent state.
- How useEffect cleanup functions prevent resource leaks. The auto-save effect's cleanup clears the pending timeout, and the keyboard effect's cleanup removes the event listener. Without these, old timeouts would still fire with stale data and old listeners would pile up on every re-render.
- How the dependency array controls when effects re-run. The history effect depends on [count] so it only fires when count changes. The keyboard effect depends on [step] so the listener gets the fresh step value. If I left step out, the ArrowUp/ArrowDown keys would always use the original step from the first render (a stale closure).
- The difference between import { useState } (runtime value, called at execution time) and import type { ChangeEvent } (type-only, erased at compile time). Modern Vite configs enable verbatimModuleSyntax which enforces this separation.

## Reflections

- Challenges faced during the project
    - Getting the auto-save debounce right was the trickiest part. My first attempt saved on every single count change immediately, which works but is wasteful. Wrapping it in setTimeout with a cleanup that calls clearTimeout means rapid clicks only result in one localStorage write after the user stops clicking.
    - The keyboard listener initially used the wrong step value after I changed the step input. The listener's closure captured the original step from when the effect first ran. Adding step to the dependency array fixed it — React tears down the old listener and creates a new one with the fresh step value.
    - The history array was duplicating the initial 0 on mount because both the initial state [0] and the first effect run (which sees count = 0) would add a zero. I kept this as-is because the effect correctly tracks every time count is "set to" a value, and the initial render setting count to 0 is a valid event.

- How you approached solving those challenges
    - For the debounce, I used the pattern from Lesson 2 — setTimeout in the effect body paired with clearTimeout in the cleanup. The cleanup runs before every re-execution of the effect, canceling any pending save before scheduling a new one.
    - For the stale closure, I followed the exhaustive-deps rule: if the effect uses step, step must be in the dependency array. This ensures the effect re-runs with a fresh closure whenever step changes, and the old listener gets cleaned up.

- What you would improve if given more time
    - Add an undo button that pops the last value from history and restores the previous count
    - Add a max/min limit option so the counter can't go below or above a threshold
    - Add visual animations when the count changes (a brief scale pulse or color flash)
    - Persist the history array to localStorage too, not just the count

## Author

Kwadwo Danso

## Acknowledgments

- React Documentation — useState (https://react.dev/reference/react/useState)
- React Documentation — useEffect (https://react.dev/reference/react/useEffect)
- React Documentation — You Might Not Need an Effect (https://react.dev/learn/you-might-not-need-an-effect)
- MDN Web Docs — KeyboardEvent (https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent)
- MDN Web Docs — localStorage (https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- MDN Web Docs — setTimeout / clearTimeout (https://developer.mozilla.org/en-US/docs/Web/API/setTimeout)
- AI for useState and useEffect, frontend, and history tracking
- Per Scholas course materials covering useState, useEffect, functional updates, dependency arrays, cleanup functions, and side effect patterns.
- Vite Documentation (https://vite.dev/guide/)