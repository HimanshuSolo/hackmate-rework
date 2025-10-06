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
git clone https://github.com/dfordp/hackmate-rework.git
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

Create a `.env` file based on `.env.example` and configure:

```env
REDIS_URL=redis://localhost:6379
DATABASE_URL=your_postgres_connection_string
DIRECT_URL=your_postgres_direct_connection_string
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret
NEXT_PUBLIC_CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
```

---

## Docker Setup

### Quick Start

#### 1. Build and Run (Production)
```bash
docker-compose up --build
```

#### 2. Build and Run (Development with hot reload)
```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

#### 3. Stop All Services
```bash
docker-compose down
```

#### 4. Stop and Remove Volumes (Clean Slate)
```bash
docker-compose down -v
```

### Services

The Docker setup includes 3 services:

1. **app** - Next.js application (port 3000)
2. **postgres** - PostgreSQL database (port 5432)
3. **redis** - Redis cache (port 6379)

### Environment Variables

Update `.env` file with your Clerk and Cloudinary credentials. The database and Redis URLs are pre-configured for Docker:

```env
DATABASE_URL=postgresql://hackmate:hackmate_password@postgres:5432/hackmate?schema=public
REDIS_URL=redis://redis:6379
```

### Database Access

To access PostgreSQL directly:
```bash
docker exec -it hackmate-postgres psql -U hackmate -d hackmate
```

### Redis Access

To access Redis CLI:
```bash
docker exec -it hackmate-redis redis-cli
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f app
docker-compose logs -f postgres
docker-compose logs -f redis
```

### Testing PostgreSQL Connection

#### 1. Check Container Health Status
```bash
# Check all containers are healthy
docker-compose ps

# Check PostgreSQL logs
docker-compose logs postgres

# Check app logs for database connection
docker-compose logs app
```

#### 2. Test PostgreSQL Connection Directly
```bash
# Connect to PostgreSQL from your host
docker exec -it hackmate-postgres psql -U hackmate -d hackmate -c "SELECT version();"

# Check if database exists
docker exec -it hackmate-postgres psql -U hackmate -c "\l"

# List all tables (after migrations)
docker exec -it hackmate-postgres psql -U hackmate -d hackmate -c "\dt"
```

#### 3. Test via App Health Endpoint
```bash
# Test the health endpoint (checks both DB and Redis)
curl http://localhost:3000/api/health

# Or in PowerShell
Invoke-WebRequest -Uri http://localhost:3000/api/health | Select-Object -Expand Content
```

#### 4. Run Prisma Studio (Visual Database Browser)
```bash
# From your host machine (not in container)
npx prisma studio

# Access at http://localhost:5555
```

#### 5. Test Database Operations
```bash
# Enter the app container
docker exec -it hackmate-app sh

# Inside container, test Prisma connection
npx prisma db execute --stdin <<< "SELECT COUNT(*) FROM \"User\";"

# Check migration status
npx prisma migrate status
```

#### 6. Monitor Real-time Database Activity
```bash
# Watch PostgreSQL activity
docker exec -it hackmate-postgres psql -U hackmate -d hackmate -c "SELECT pid, usename, application_name, client_addr, state, query FROM pg_stat_activity WHERE datname = 'hackmate';"
```

### Troubleshooting

#### Port Already in Use
If ports 3000, 5432, or 6379 are already in use, stop the conflicting services or modify the ports in `docker-compose.yml`.

#### Database Connection Issues
```bash
# Check if PostgreSQL is accepting connections
docker exec -it hackmate-postgres pg_isready -U hackmate

# View detailed PostgreSQL logs
docker logs hackmate-postgres -f

# Restart PostgreSQL container
docker-compose restart postgres
```

#### App Can't Connect to Database
```bash
# Verify DATABASE_URL environment variable
docker exec -it hackmate-app printenv | grep DATABASE_URL

# Test connection from app container
docker exec -it hackmate-app npx prisma db execute --stdin <<< "SELECT 1;"
```

#### Clean Rebuild
```bash
docker-compose down -v
docker-compose build --no-cache
docker-compose up
```

---

## Future Development

Planned features include:

* Role and interest-based filtering (e.g., designer, product, engineering)
* Matching based on timezone and geography
* Project pitch cards and lightweight portfolios
* Improved match feed and conversation prompts


Here’s a **`CONTRIBUTING.md`** file written in the same style as your `README.md` (no emojis, no AI buzzwords, no double dashes, and keeping the passion-project tone):


# Contributing to Hackmate

Thank you for your interest in contributing. Hackmate started as a side project to explore whether swipe-style discovery could improve how founders and builders connect. Every contribution, whether big or small, helps move the project forward.

For Discussions Join : [Discord](https://discord.gg/E8MaEyD7ws)

## How to Get Started

1. **Fork the repository** and clone your fork locally.
2. **Set up the environment** following the steps in the README.
3. Create a new branch for your work with a descriptive name.
4. Make your changes in small, focused commits.
5. Run the linter and tests before pushing.
6. Submit a pull request against the `main` branch.


## Reporting Issues

If you encounter a bug or want to suggest an improvement, open an issue. Please include:

* A clear title and description.
* Steps to reproduce the problem (if reporting a bug).
* Expected behavior versus actual behavior.
* Screenshots, logs, or environment details if relevant.

For sensitive security-related issues, please do not file a public issue. Instead, reach out directly to the maintainer.

## Suggesting Features

Before starting work on a new feature, open an issue to discuss the idea. This helps ensure efforts are aligned with the direction of the project. Describe:

* The problem you are solving.
* The proposed solution.
* Any impact on the existing data model or flows.


## Code Guidelines

* Follow existing patterns in the codebase.
* Use TypeScript where possible to keep types clear and reduce errors.
* Keep functions small and focused.


## Development Environment

* **Frontend:** Next.js with Tailwind CSS
* **Backend:** Prisma with PostgreSQL
* **Real-time:** Redis for caching and match detection
* **Auth:** Clerk
* **Hosting:** Vercel

Environment variables are required for Redis and Postgres (see README).


## Pull Requests

When opening a pull request:

* Reference any related issue.
* Summarize the change in the PR description.
* Add migration or setup notes if needed.
* Keep PRs small and focused for easier review.


## Community and Communication

The project also has a community Discord server where contributors share ideas, feedback, and roadmaps. Once you make your first contribution, feel free to join and introduce yourself.



## License

MIT License. Hackmate is open for experimentation, forking, and extension.
