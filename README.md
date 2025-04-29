# job-search-tracker

Some tools for my 2025 job search.

## Overview

- Top priorities in making these tools:
  - Explore some new tech & tools.
  - Improve my efficiency & insight.
- Not a priority:
  - Generalizing this so that others can use it.
  - Clean architecture and code with an eye toward longer-term maintenance or readability.
  - Design, responsiveness, tests, security, scale & performance, etc.
  - (In other words, don't judge this—or anything in my public github for that matter—as if it were my professional work.)

I might eventually share these by deploying them publicly with demo data, but for now I'm only running them locally.

## Screenshots

![screenshot of analysis charts](/sample_data/analysis.png)

![screenshot of application list](/sample_data/applications.png)

## Some things I'm learning/exploring/reinforcing so far

- [Vite](https://vite.dev/) instead of [Webpack](https://webpack.js.org/)
- Forcing myself to use [Typescript](https://www.typescriptlang.org/) more.
- Visualizations with [Plot](https://observablehq.com/plot/) and [ECharts](https://echarts.apache.org/) instead of [Chart.js](https://www.chartjs.org/).
- [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) instead of [axios](https://www.npmjs.com/package/axios).

## Install and run

As I mentioned above, I haven't any effort into making this usable by others yet. But if you really want to try it ...

```
# frontend:
cd frontend
npm install
npm run dev

# backend:
cd frontend
npm install
export SERVER_PORT="3000"
export LOCAL_FILESYSTEM_DATA_PATH="/Users/me/code/job-search-tracker/data"
npm run dev
```
Then visit http://localhost:5173/job-search-tracker/ in your browser.