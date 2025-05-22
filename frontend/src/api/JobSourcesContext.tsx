import { createContext } from "react";

// Don't judge me for this choice!!
// I've never used useContext before. This was mostly an excuse to try that out.
// Otherwise I definitely would've kept this feature tighter and more self-contained.

// A list of job sources. Used by application form to encourage re-use.

const JobSourcesContext = createContext({
    jobSources: [] as string[],
    // This is a placeholder. We'll define the real setJobSources when we use the provider.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setJobSources: (_: string[]) => {},
});

export default JobSourcesContext;
