# Hackmate

[![Hackmate on Peerlist](https://peerlist.io/api/v1/projects/embed/PRJHJKNR7KLEGQGOG1AQJJMBRREMRN?showUpvote=false&theme=light)](https://peerlist.io/dfordp/project/hackmate)
[![Hackmate on Product Hunt](https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1018821&theme=light)](https://www.producthunt.com/products/hackmate?utm_source=badge-featured&utm_medium=badge&utm_source=badge-hackmate)


**Live project:** [hackmate.app](https://hackmate.app/)

---

## Overview

Hackmate is a swipe-based matchmaking platform designed for founders and builders to meet potential co-founders, collaborators, and indie hackers.

Instead of social media profiles and endless bios, Hackmate focuses on skills, intent, and mutual interest. Users create lightweight profiles, swipe to express interest, and get matched in real time if there is mutual alignment.

The app was built to make collaboration faster and more intentional for startup ecosystems, hackathons, and builder communities.

---

## How It Works

1. Users create a profile with their skills, experience, and goals.
2. The app shows other profiles that can be swiped right (interested) or left (skip).
3. When two users swipe right on each other, they instantly appear in a shared match queue.
4. Matched users can view details and connect immediately.

This approach removes friction from networking by focusing only on aligned intent and relevant skills.

---

## Key Features

* **Swipe-based discovery**: Browse and evaluate potential collaborators quickly.
* **Real-time matches**: Matches appear instantly through a Redis-backed caching layer.
* **Mutual-only visibility**: Users only see interest if it is reciprocated, reducing pressure.
* **Skill-focused profiles**: Profiles highlight what users can do and what they have built.
* **Low-latency infrastructure**: Redis and WebSockets ensure fast responses for swipes and matches.

---

## Technology Stack

**Frontend**

* Next.js for the web application
* Tailwind CSS for styling

**Backend**

* PostgreSQL for structured data
* Redis for real-time caching and match detection

**Infrastructure**

* Vercel for hosting
* Redis running locally via Docker or in the cloud (Upstash, Aiven, etc.)

---

## Redis Store Design

| Purpose       | Type | Key Format          | Example                          |
| ------------- | ---- | ------------------- | -------------------------------- |
| Likes Given   | SET  | `likes:<user_id>`   | Used to prevent duplicate swipes |
| Match Queue   | LIST | `matches:<user_id>` | Stores mutual matches            |
| User Profiles | HASH | `user:<user_id>`    | Caches basic profile information |

Other matching logic, such as filtering, exclusions, and scoring, is handled through the backend services.

---

## Local Development Setup

Clone the repository:

```bash
git clone https://github.com/your-username/hackmate.git
cd hackmate
```

Install dependencies:

```bash
npm install
```

Run Redis locally or connect to a cloud provider:

```bash
docker run -p 6379:6379 redis
```

Start the development server:

```bash
npm run dev
```

Environment configuration:

```env
REDIS_URL=redis://localhost:6379
```

---

## Future Development

Planned features include:

* Role and interest-based filtering (e.g., designer, product, engineering)
* Matching based on timezone and geography
* Project pitch cards and lightweight portfolios
* Improved match feed and conversation prompts

---

## Contributing

Hackmate began as a side project to test whether swipe-style discovery could improve collaboration in builder communities. Contributions, ideas, and feedback are welcome. Open an issue, create a pull request, or reach out directly.

---

## License

MIT License. Hackmate is open for experimentation, forking, and extension.
