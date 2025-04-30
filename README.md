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

## Demo

I deployed to [github pages](https://joecullin.github.io/job-search-tracker/Analysis) with anonymized data. The dates, statuses, and applications are my own real job search data, but the company names & notes have been scrubbed.

(I haven't put effort into window sizes beyond my macbook air. Hopefully it's not awful-looking on your screen.)

## Screenshots

![screenshot of analysis charts](/sample_data/analysis.png)

![screenshot of application list](/sample_data/applications.png)

## Some things I'm learning/exploring/reinforcing so far

- [Vite](https://vite.dev/) instead of [Webpack](https://webpack.js.org/)
- Forcing myself to use [Typescript](https://www.typescriptlang.org/) more.
- Visualizations with [Plot](https://observablehq.com/plot/) and [ECharts](https://echarts.apache.org/) instead of [Chart.js](https://www.chartjs.org/).
- [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) instead of [axios](https://www.npmjs.com/package/axios).
- [GitHub Actions and Pages](https://docs.github.com/en/actions) instead of [GitLab CI/CD](https://docs.gitlab.com/ci/), Azure DevOps, Jenkins, etc.
- [Zustand](https://www.npmjs.com/package/zustand) instead of [Redux](https://www.npmjs.com/package/redux).

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