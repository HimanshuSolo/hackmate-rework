
# 🚀 Hackmate

**Hackmate** is a swipe-based matchmaking platform designed to help founders and builders discover potential co-founders, collaborators, or indie hackers to work with — Tinder-style.

No social profiles, no fluff. Just raw experience, aligned intent, and mutual interest.

---

## 🧠 What is Hackmate?

A real-time matchmaking app where users:

- Create a profile with their skillset, experience, and goals
- Swipe right to express interest in working with someone
- Get matched if there's a mutual right swipe
- View new matches in a dynamic queue

Hackmate is built for fast, low-friction connections in startup ecosystems, hackathons, and builder communities.

---

## 💡 Key Features

- 🃏 **Swipe-based interface** – Discover people by swiping right or left
- ⚡️ **Real-time match queue** – Get notified instantly when you match
- 🔒 **No social pressure** – No likes shown unless it's mutual
- 🧰 **Skill-first profiles** – Show what you’ve built, not just where you studied
- 🧠 **Cache-accelerated backend** – Uses Redis for real-time interactions

---

## ⚙️ Tech Stack

### 🖥 Frontend
- Next.js 
- Tailwind CSS for rapid UI styling

### 🛠 Backend
- Redis for real-time caching
- PostgreSQL 

### ☁️ Infrastructure
- Redis 
- Vercel 

---

## 🧱 Redis Store Structure

| Key Purpose       | Redis Type | Key Format          | Example Usage            |
|-------------------|------------|----------------------|---------------------------|
| Likes Given       | `SET`      | `likes:<user_id>`    | Prevent duplicate swipes |
| Match Queue       | `LIST`     | `matches:<user_id>`  | Fetch mutual matches     |
| User Profiles     | `HASH`     | `user:<user_id>`     | Cached basic user info   |

> Compatibility scores and seen/blocked users are handled through API logic, not Redis.

---

## 📦 Local Setup

```bash
# Clone the repo
git clone https://github.com/your-username/hackmate.git
cd hackmate

# Install dependencies
npm install

# Setup Redis (using Docker or cloud URL)
docker run -p 6379:6379 redis
# OR use Aiven/Upstash and set REDIS_URL

# Start the dev server
npm run dev
````

> Make sure you set environment variables:

```env
REDIS_URL=redis://localhost:6379
```

---

## 🧠 Future Plans

* 🎯 Interest-based filtering (builder vs designer vs product)
* 🌐 Geo/Timezone-based matching
* 🛠 Project pitch cards and mini portfolios
* 🤖 AI-based match suggestions

---

## 🤝 Contributing

Hackmate is still in its early indie stage. PRs, ideas, and collaborators are welcome. Create an issue or reach out directly.



## 📜 License

MIT License — feel free to fork and build your own version.



Let me know if you'd like to include:
- An architectural diagram
- Swagger/OpenAPI documentation
- or a deploy button for one-click setup on Railway/Vercel

I can also tailor this for a `monorepo` if your backend/frontend are in one project.
