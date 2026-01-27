[Messages Translated](https://translatewiki.net/wiki/Special:MessageGroupStats?group=wikimedia-tools-campwiz-frontend&messages=&suppressempty=1)
# CampWiz Frontend Server
This is CampWiz Frontend Server. It is responsible for the frontend of the CampWiz application. It is built using Next.js and TypeScript as well as TailWindcss and MaterialUI for styling. It is a monorepo that contains the frontend server and the shared components library.
## Getting Started
First, run the development server:
- Create a `.env` file in the root directory and add your environment variables. You can use `.env.example` as a reference.
- Install dependencies: `npm install` or `yarn install` or `pnpm install` or `bun install`
- Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
- Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
## Learn More
To learn more about CampWiz, take a look at the following resources:
- [CampWiz Github Repository](https://github.com/nokibsarkar/campwiz)
## Some  MileStones
### 03-03-2025 Reduction in production size
**Hash**: [cd24d41d5140f4e16217bab13e476d16f2a0bdf1](https://github.com/nokibsarkar/campwiz-frontend/commit/330abc453bf0725228b4fe6fb0c3c93785a0ef67)

Reduction in production size from 2.5 GB (approximately) to 137 MB (approximately) using `standalone` build. 

### 14-05-2025 11:41 PM BST: Deployed to Toolforge
**Hash**: [2eeecaca4476e4994f5ce597a0637e5b8c721c0c](https://github.com/nokibsarkar/campwiz-frontend/commit/2eeecaca4476e4994f5ce597a0637e5b8c721c0c)

After A lot of effort, I was able to deploy the frontend server to Toolforge ([campwiz.toolforge.org](https://campwiz.toolforge.org)). The deployment process was quite challenging, but I learned a lot along the way. I had to make several changes to the codebase to make it compatible with Toolforge's environment. Thank You very much @dhinus for your support. 

The project is built and run using Node.js version 18 to ensure compatibility with the Toolforge environment. Both the build process (via GitLab CI) and the runtime environment on Toolforge use Node.js 18. The project is built as a `standalone` build, uploaded to `~/www/js/`, where a `.env` file is created with the necessary environment variables.
### 16-05-2025 03:15 PM BST: Issue with Toolforge
