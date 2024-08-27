# DND - Digital Dungeon Master's Assistant

This project is a Next.js-based web application designed to assist Dungeon Masters in managing their Dungeons & Dragons campaigns.

## Project Overview

DND is a digital tool that streamlines the process of running D&D games by providing:

- Character sheet management
- Encounter tracking
- Dice rolling simulation
- Rule reference lookup

Built with modern web technologies, this app aims to enhance the tabletop RPG experience while maintaining the essence of traditional gameplay.

## Technical Stack

- **Frontend**: Next.js 13+ with App Router
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Database**: [Your database choice, e.g., PostgreSQL, MongoDB]
- **Authentication**: [Your auth solution, e.g., NextAuth.js]

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

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
# DND

## Troubleshooting

If you encounter issues with Tailwind CSS classes not being recognized:

1. Ensure that `tailwind.config.ts` is properly configured.
2. Verify that `postcss.config.js` includes Tailwind CSS as a plugin.
3. Check that `globals.css` includes the necessary Tailwind directives.
4. Clear the Next.js cache by deleting the `.next` folder and rebuilding the project.
5. Update all dependencies to their latest compatible versions.

If problems persist, try temporarily disabling Tailwind to isolate the issue.
