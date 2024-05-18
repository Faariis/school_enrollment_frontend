This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started
### Run with docker
- Navigate to `docker` folder
- Execute
```bash
$ docker compose up --build
```
- Check your containers
```bash
$ docker ps
CONTAINER ID   IMAGE                  COMMAND                  CREATED         STATUS             PORTS                                                                     NAMES
80098992ba46   nginx:latest           "/docker-entrypoint.…"   8 seconds ago   Up 7 seconds       0.0.0.0:9191->80/tcp, :::9191->80/tcp                                     nginx_container
1e8eea7e1951   myenrollment:latest    "docker-entrypoint.s…"   8 seconds ago   Up 7 seconds       0.0.0.0:3535->3000/tcp, :::3535->3000/tcp                                 myenrollment_container
```
- Go to `localhost:35353`
- To stop the container open new terminal and run
```bash
$ docker compose down -v
```

### Install locally
- First, install `npm` server and `node` version 18
```bash
$ sudo apt install npm
```
For Debian/Ubuntu checkout [manual-installation-of-nodejs](https://github.com/nodesource/distributions#manual-installation)

- After, install dependencies
```bash
$ npm install
```

- Run the development server:

```bash
$ npm run dev
# or
$ yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
