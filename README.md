# Smart Customer Feedback Triage Dashboard

An inbox-style triage tool designed for Ocado Retail’s customer service team. Customer service agents can quickly browse, search and filter customer feedback, open individual items, and use "Summarise & categorise" to get a live AI-generated analysis from Google Gemini.

## Tech Stack
React 19 (JavaScript & JSX)
Vite
Tailwind CSS v4
Zustand
react-markdown
Vitest & React Testing Library

## 1. Setup
Requires Node 20+

cd FeedbackTriage
npm install
npm run dev

Open the local URL printed by Vite. Example: http://localhost:5173/

The application works with sample feedback and a simulated AI provider by default. 
To enable Gemini, copy .env.example to .env.local, set GEMINI_API_KEY, and restart the development server, follow:

cp .env.example .env.local
### add your key, GEMINI_API_KEY=<your key>
npm run dev


### For testing
npm test

## 2. Architecture and Data

- src/app/ assembles the application layout.
- src/components/ contains shared UI components and layout elements.
- src/features/feedback/ handles the inbox, filters, feedback details, triage updates, and notes.
- src/features/ai/ handles streamed analysis, suggestion review, and interchangeable mock/Gemini providers.
- src/data/, src/hooks/, and src/utils/ contain sample data and shared helpers.

Data flows one way: components call store actions, the stores update, and pure functions derive what to display.

**Data structures**

- **Feedback item**: customer details, message content, channel, timestamps, a nested `triage` object and a `notes` array.
- **Triage**: status (`new`, `in_progress`, `resolved`), sentiment, category, and classification source (`ai` or `agent`). Sentiment and category start as `null`, meaning "not classified yet".
- **AI analysis**: one per feedback item. It tracks progress (`idle → connecting → streaming → complete / cancelled / error`), the streamed text, the parsed suggestion, errors, and the review outcome (`pending`, `applied`, `dismissed`).

**State**

Zustand manages shared state (feedback, AI analyses, notifications). Components subscribe only to the values they need, so streaming AI text re-renders the AI panel without re-rendering the feedback list. Component-local state (`useState`) handles temporary UI such as form drafts and open menus.

**Streaming**

Responses stream from Gemini over server-sent events (SSE) and are parsed incrementally. Text is appended at most once per animation frame to keep rendering smooth. Each analysis can be stopped by the agent, times out if the stream stalls, and is cancelled cleanly if a newer request replaces it.


## 3. Assumptions and Design Decisions

- **Sample data, no backend:** feedback comes from a simulated API using seeded data. Changes are held in memory and reset on page reload.
- **Agent-controlled classification:** AI suggestions pre-fill an editable form. **Apply** saves the selected sentiment and category without changing status, **Dismiss** leaves triage unchanged, and **Undo** restores the previous triage. Applied values are recorded as `ai` if the suggestion was accepted unchanged, or `agent` if it was edited.
- **Responsive layout:** sidebar, inbox and detail panels on large screens; inbox and detail side by side on laptops; one panel at a time on tablets and phones.
- **Selection:** no item is selected on first visit, so phones show the inbox first. The open item is stored in `?item=` to support direct links and refreshes.
- **Accessibility:** native controls, accessible labels, a skip link, focus management on narrow screens, and screen-reader announcements for AI status support keyboard and assistive-technology use. These features do not establish full WCAG 2.2 AA compliance.
- **Credential handling:** Gemini requests go through a Vite proxy, keeping the API key out of browser code. Production hosting would need an equivalent server-side endpoint.
- **Deferred scope:** URL-synced filters, backend persistence, E2E tests, dark mode and list virtualisation. The sample dataset is small enough to render without virtualisation.


## 4. AI Tools During Development

I used Claude as a development assistant, mainly for scaffolding, drafting tests, and reviewing code and to structure README contents. I made the architecture and product decisions, and reviewed and tested all code before including it.