# Sonnen Frontend Task - Amr Elnaggar

## Description

This project is a data visualization dashboard featuring a **Battery Charging Levels Chart** using **Next.js**, **TypeScript** and **ShadCN** components. The dashboard allows users to filter charging data by time range within the last 24 hours.
### Demo
Check it live [here](https://sonnen-frontend.vercel.app/).
### Lighthouse results
<img width="674" alt="image" src="https://github.com/user-attachments/assets/6eeb4f1a-4542-44c6-9a06-ae0ed4c37869" />

## Features

- Dynamic **Line Chart** for battery charging levels.
- Data filtering options (6h, 12h, 24h).
- Loading and error handling with a Skeleton component and alerts.
- Responsive and compact design.
- Dates will be adjusted to the user's timezone.
- Dates will show in the format of the user's browser's locale, including translation.
- Time will follow the format of the user's browser's locale (12/24-hour format).
- The **Y-axis ticks** are spaced efficiently for better readability on small and large screens.
- The container has a fixed max-width to maintain consistent appearance.
- Built with Accessibility and Semantic HTML in mind.

## Technologies Used

- **React 19**
- **Next.js 15.2.1**
- **TypeScript**
- **Tanstack Query**
- **Tailwind CSS v4**
- **ShadCN** (for UI components)
- **Recharts** (for data visualization)
- **Luxon** (for date/time formatting)
- **Google Fonts**

## Installation

```bash
# Clone the repository
git clone https://github.com/AmrElnaggar99/sonnen-frontend.git
cd sonnen-frontend

# Install dependencies
npm install # or yarn install

# Start the development server
npm run dev # or yarn dev
```

## Usage

1. Open the app in a browser (http://localhost:3000/).
2. Hover over data points to see detailed insights.
3. Select a different time range from the dropdown if needed.

## Design Decisions

### Framework choice

- Even if an app does not need routing or SSR, using Next.js can still be justified for:
  - Automatic Code Splitting
  - Image Optimization
  - built in API Routes
- I could have used Vite, but I chose not to because of the API routes feature in next for the following:
  - Having an API route is making a real fetch request even if with mock data.
  - When the real API is available, we only need to change the request in `fetch()` and everything regarding the response is going to be already handled.
  - To achieve this exact behavior in Vite, we would need to setup an express server which is unnecessary complexity.
  - We could have just imported the JSON file as a response to a promise, but this will require a rewrite for the tests when the actual API is made.

### Why fetch data on the client?

- There is no need for SEO in dashboards.
- Fetching on the client will have a faster [first contentful paint](https://developer.mozilla.org/en-US/docs/Glossary/First_contentful_paint).
- We use React Query to allow stale-while-revalidate caching.
  > While it’s not needed while we only have fake JSON response but it is good to have it for when we change the request to the actual real endpoint.

### UI Styles

- To get the task done in less than 4 hours as required, I opted for using [Shadcn](https://ui.shadcn.com/) since it has pre-styled components.
- My knowledge in HTML and CSS can still be evaluated from the JSX and the use of [Tailwind](https://tailwindcss.com/).

### Handling Dates and Time

- I would usually go for [Dayjs](https://www.npmjs.com/package/dayjs) because it's the most lightweight date formatting package.
- But I noticed the dates in the JSON data include `Z` which means `UTC` time, which in turn means we need to support different timezones.
- According to my experience, all date packages introduce bugs when working with timezones except [Luxon](https://www.npmjs.com/package/luxon).
- Therefore, to offer timezone compatibility, Luxon is adopted in this project.

## Possible Future Enhancements

- Make the "last 6 hours" filter the default on mobiles. (Need to check for business needs)
- Show current battery level.
- Add animations for better UX.
- Provide additional filtering options for custom date ranges.
