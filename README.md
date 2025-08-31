# Tone Picker Tool

A professional, modern Next.js 15 (App Router) web app for rewriting text in different tones using Mistral AI. Features a Figma-like text editor, a 3x3 tone matrix selector, undo/redo, and responsive design for desktop and mobile.

---

## 🚀 Live Demo

- **Deployed App:** [https://your-vercel-or-render-link.com](https://fiddle-nine.vercel.app)
- **Demo Video:** [watch here](https://www.dropbox.com/scl/fi/8wio3ayqi65txcleryyn6/fiddle-demo.mp4?rlkey=wwbe3koajqxnhyg1nzgwc0woa&st=ek87boum&dl=0) *(replace with your video link)*

---

## 🛠️ Local Setup

1. **Clone the repository:**
	 ```bash
	 git clone https://github.com/your-username/tone-picker-tool.git
	 cd tone-picker-tool
	 ```
2. **Install dependencies:**
	 ```bash
	 npm install
	 ```
3. **Set up environment variables:**
	 - Copy `.env.local.example` to `.env.local` and add your Mistral API key:
		 ```env
		 MISTRAL_API_KEY=your-mistral-api-key-here
		 ```
4. **Run the development server:**
	 ```bash
	 npm run dev
	 ```
5. **Open the app:**
	 - Visit [http://localhost:3000](http://localhost:3000)

---

## 🧑‍💻 Technical Architecture & Decisions

- **Framework:** Next.js 15 (App Router) for modern routing and serverless API routes.
- **Styling:** TailwindCSS for rapid, responsive, and maintainable UI.
- **API Integration:** Secure backend route (`/api/change-tone`) calls Mistral AI with a system prompt for tone transformation.
- **Componentization:** Modular React components for editor, tone matrix, loader, and skeletons.
- **Responsiveness:** Mobile-first design, grid and controls adapt to all screen sizes.
- **Trade-offs:**
	- Used a simple textarea for editing (no rich text) for speed and reliability.
	- State is reset on reload for privacy and demo clarity.

---

## 🗂️ State Management & Undo/Redo

- **Custom Hook:** `useHistory` manages text state with `past`, `present`, and `future` arrays.
- **Undo/Redo:**
	- `undo` and `redo` buttons traverse history.
	- State is persisted in `localStorage` (but cleared on reload for demo/testing).
- **Reset:** Clears all history and text.

---

## ⚠️ Error Handling & Edge Cases

- **API Errors:**
	- Handles network failures, missing/invalid API keys, and invalid Mistral responses.
	- User-friendly error messages shown in the UI.
- **Input Validation:**
	- Disables tone change if text is empty.
- **Loading States:**
	- Shows a skeleton loader in the editor while waiting for API responses.

---

## 📹 Demo Video

- Please see the attached `demo.mp4` or [video link](#) for a walkthrough of all features and UI/UX.

---

## 📄 License

MIT
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
