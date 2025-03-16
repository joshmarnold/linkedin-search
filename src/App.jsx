import { Theme } from "@radix-ui/themes";
import Header from "./Header";
import JobQueryBuilder from "./JobQueryBuilder";
import useTheme from "./useTheme"; // Import the custom hook
import "@radix-ui/themes/styles.css";

export default function MyApp() {
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <Theme appearance={resolvedTheme}>
      <Header setTheme={setTheme} theme={resolvedTheme} />
      <JobQueryBuilder />
    </Theme>
  );
}
