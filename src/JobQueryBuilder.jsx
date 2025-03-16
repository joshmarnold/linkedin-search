import { useState, useEffect } from "react";
import { CheckCircledIcon, Cross1Icon, PlusIcon } from "@radix-ui/react-icons";
import {
  Button,
  Flex,
  IconButton,
  ScrollArea,
  TextArea,
  TextField,
  Text,
} from "@radix-ui/themes";
import { Toast } from "radix-ui";

const LOCAL_STORAGE_KEY = "jobQueryData";

const parseQuery = (query) => {
  const match = (regex) =>
    query
      .match(regex)?.[1]
      .split(/\" OR \"/)
      .map((s) => s.replace(/\"/g, "").trim()) || [];

  return {
    titles: match(/^\((.*?)\)/),
    exclusions: match(/NOT \((.*?)\)/),
    locations: match(/AND \((.*?)\)$/),
  };
};

const Section = ({ title, items = [], add, remove, input, setInput }) => {
  const sortedItems = items.sort((a, b) => a.localeCompare(b));
  return (
    <Flex
      direction={"column"}
      p={"16px"}
      style={{
        backgroundColor: "var(--gray-a2)",
        borderRadius: "8px",
        flex: 1,
        minWidth: "250px",
      }}
    >
      <TextField.Root
        placeholder={title}
        onChange={(e) => setInput(e.target.value)}
        value={input}
        onKeyDown={(e) => {
          if (e.key === "Enter" && input.trim()) {
            add();
          }
        }}
      >
        <TextField.Slot side="right">
          <IconButton size="1" variant="ghost" onClick={add} disabled={!input}>
            <PlusIcon height="14" width="14" />
          </IconButton>
        </TextField.Slot>
      </TextField.Root>

      {/* Scrollable list container */}
      <ScrollArea
        type="always"
        scrollbars="vertical"
        style={{ height: 300, marginTop: 10 }}
      >
        {sortedItems.map((item, idx) => (
          <Flex
            key={idx}
            justify={"between"}
            align={"center"}
            gap={"8px"}
            pr={"14px"}
            className="ListItem"
            role="row"
            tabIndex="0"
            aria-label={item}
          >
            <Text size="2">{item}</Text>
            <IconButton
              aria-label={`Remove ${item}`}
              size="1"
              variant="ghost"
              onClick={() => remove(idx)}
            >
              <Cross1Icon height="12" width="12" />
            </IconButton>
          </Flex>
        ))}
      </ScrollArea>
    </Flex>
  );
};

export default function JobQueryBuilder({ setTheme, theme }) {
  const [state, setState] = useState(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    return savedData
      ? JSON.parse(savedData)
      : { titles: [], exclusions: [], locations: [] };
  });

  const { titles, exclusions, locations } = state;
  const [titleInput, setTitleInput] = useState("");
  const [exclusionInput, setExclusionInput] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [savedQuery, setSavedQuery] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addItem = (key, item, setItem) => {
    if (item.trim() !== "") {
      setState((prev) => ({ ...prev, [key]: [...prev[key], item.trim()] }));
      setItem("");
    }
  };

  const removeItem = (key, index) => {
    setState((prev) => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== index),
    }));
  };

  const generateQuery = () => {
    const format = (arr) => arr.map((item) => `\"${item}\"`).join(" OR ");
    return `(${format(titles)}) NOT (${format(exclusions)}) AND (${format(
      locations
    )})`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateQuery());
    setOpen(true);
  };

  const loadSavedQuery = () => {
    if (savedQuery.trim()) {
      setState(parseQuery(savedQuery));
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify(parseQuery(savedQuery))
      );

      setSavedQuery("");
    }
  };

  return (
    <Flex direction={"column"} p={"16px"} gap={"16px"}>
      <Toast.Provider swipeDirection="right" duration={4000}>
        <Toast.Root className="ToastRoot" open={open} onOpenChange={setOpen}>
          <Flex gap={"16px"} align={"center"}>
            <Flex direction={"column"} gap={"0px"}>
              <Toast.Title>
                <Flex align={"center"} gap={"8px"}>
                  <CheckCircledIcon
                    color="green"
                    height={"18px"}
                    width={"18px"}
                  />
                  <Text mb={"1px"}>Copied to clipboard</Text>
                </Flex>
              </Toast.Title>

              <Toast.Description>
                <Text size="1" color="gray">
                  Paste the query into LinkedIn's search bar.
                </Text>
              </Toast.Description>
            </Flex>
          </Flex>
        </Toast.Root>
        <Toast.Viewport className="ToastViewport" />

        {/* Saved Query Input */}
        <Flex direction={"column"} gap={"8px"}>
          <TextArea
            value={savedQuery}
            onChange={(e) => setSavedQuery(e.target.value)}
            placeholder="Paste prior query strings here to autofill fields (will overwrite current data)"
            style={{ width: "100%" }}
          />
          <Button disabled={!savedQuery.trim()} onClick={loadSavedQuery}>
            Load Query
          </Button>
        </Flex>

        {/* Query Builder */}
        <Flex justify={"between"} gap={"16px"} wrap={"wrap"}>
          <Section
            title="Job Titles"
            items={titles}
            input={titleInput}
            setInput={setTitleInput}
            add={() => addItem("titles", titleInput, setTitleInput)}
            remove={(idx) => removeItem("titles", idx)}
          />
          <Section
            title="Exclude (Companies, Title Words)"
            items={exclusions}
            input={exclusionInput}
            setInput={setExclusionInput}
            add={() => addItem("exclusions", exclusionInput, setExclusionInput)}
            remove={(idx) => removeItem("exclusions", idx)}
          />
          <Section
            title="Locations"
            items={locations}
            input={locationInput}
            setInput={setLocationInput}
            add={() => addItem("locations", locationInput, setLocationInput)}
            remove={(idx) => removeItem("locations", idx)}
          />
        </Flex>

        <Button size="4" onClick={copyToClipboard}>
          Copy Query
        </Button>
      </Toast.Provider>
    </Flex>
  );
}
