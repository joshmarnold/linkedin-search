import { Theme } from "@radix-ui/themes";
import Header from "./Header";
import JobQueryBuilder from "./JobQueryBuilder";
import useTheme from "./useTheme";
import { Analytics } from "@vercel/analytics/react";
// Import the custom hook
import "@radix-ui/themes/styles.css";

export default function MyApp() {
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <Theme appearance={resolvedTheme}>
      <Analytics />
      <Header setTheme={setTheme} theme={resolvedTheme} />
      <JobQueryBuilder />
    </Theme>
  );
}
