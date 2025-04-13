# My Diary Website

A simple diary website built with Next.js where you can create and share diary entries. This application allows you to:

- Create diary entries with a title and content
- View a list of all your entries
- Read individual entries on dedicated pages
- Share entry links with others

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- **Create Entries**: Write new diary entries with a title and content.
- **View Entries**: See a list of all your diary entries with quick previews.
- **Read Full Entries**: Click on an entry to read the full content on a dedicated page.
- **Share with Others**: Share the URL of a specific entry to let others read it.

## Deployment on Vercel

The easiest way to deploy this diary website is to use the [Vercel Platform](https://vercel.com).

1. Push your code to a GitHub repository
2. Import the project to Vercel
3. Vercel will detect Next.js and set up the optimal build settings automatically
4. Your site will be deployed and available at a Vercel URL

## How Data is Stored

Currently, diary entries are stored in a JSON file in the application's filesystem. For production use, you might want to consider:

- Using a database for persistent storage
- Adding authentication to protect your diary entries
- Adding more features like editing or deleting entries

## License

This project is open source and available under the [MIT License](https://opensource.org/licenses/MIT).
