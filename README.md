# ReachInbox Assignment

This is a full-featured React-based web application that simulates an email thread management system. It includes user authentication (email & Google login), fetching, replying, deleting, and resetting of email threads via APIs. The interface features a responsive sidebar layout and day/night theme switching.

![App Screenshot](./src/images/image.png)

## 🚀 Features

- 🔐 Login & Signup (Email/Password + Google OAuth)
- 📥 Fetch all email threads from server
- 🗑️ Delete a thread from the server
- ♻️ Reset threads
- 📬 Reply to threads
- 🌗 Day/Night Mode toggle
- 🧭 Sidebar navigation (OneBox.js)
- 🧩 Dynamic component rendering based on route
- 🛠️ Clean modular file structure

---

## 📁 Folder Structure

```bash
reachinbox-assignment/
├── build/
├── node_modules/
├── public/
│   ├── favicon.ico
│   └── index.html
├── src/
│   ├── components/
│   │   ├── getThreads.js
│   │   ├── login.css
│   │   ├── Login.js
│   │   ├── LoginForm.js
│   │   ├── OneBox.css
│   │   ├── OneBox.js
│   │   ├── ResetOneBox.css
│   │   ├── ResetOneBox.js
│   │   ├── Signup.js
│   │   ├── SignupForm.js
│   │   ├── ThreadDeletion.css
│   │   ├── ThreadDeletion.js
│   │   ├── ThreadList.js
│   │   ├── ThreadReply.css
│   │   └── ThreadReply.js
│   ├── images/
│   │   └── image.png
│   ├── App.css
│   ├── App.js
│   └── index.js
├── package.json
├── package-lock.json
└── README.md



---
```

## 🧑‍💻 How to Fork or Clone This Repo

### 🔁 Fork This Repository

1. Visit [this repo]([https://github.com/YOUR_USERNAME/reachinbox-assignment](https://github.com/ARDEV04/reachinbox-assignment))
2. Click the **"Fork"** button in the top-right corner

### 📥 Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/reachinbox-assignment.git
cd reachinbox-assignment
```

## 🛠️ Installation & Running the App
### Make sure you have Node.js and npm installed.

```bash
# Install dependencies
npm install
# Start development server
npm start
```

## 🎥 Demo

📹 **Video Walkthrough**

[![Watch the demo](./src/images/image.png)](https://drive.google.com/file/d/19QDg8qDCyHwDyykBcwivfXI_gw6IRUKE/view?usp=drive_link)


## 🧰 Tech Stack
- Frontend: React, JSX, CSS
- Routing & State: useState, useEffect
- Authentication: Email/Password & Google OAuth
- API: fetch or axios to interact with backend
- UI: Responsive layout with light/dark mode

## 🤝 Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.
