import {
  Flex,
  Text,
  Select,
  Popover,
  IconButton,
  DataList,
} from "@radix-ui/themes";
import {
  SunIcon,
  MoonIcon,
  QuestionMarkIcon,
  Cross2Icon,
} from "@radix-ui/react-icons";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { useState } from "react";

const About = () => {
  const step1 = "Step 1: Generate your custom search query below.";
  const step2 = "Step 2: Paste it into LinkedIn's search bar.";
  return (
    <Flex direction="column" gap="2" p={"4px 16px 16px 16px"}>
      <Text as="p" size="2" tabIndex="0">
        LinkedIn allows you to search for multiple job titles, specify locations
        and exclude certain words or companies—all in one query.
      </Text>

      <Separator my="3" size="4" />

      <Text as="p" size="2" weight="bold" tabIndex="0">
        Here's how it works:
      </Text>

      <DataList.Root>
        <DataList.Item>
          <DataList.Value tabIndex="0" aria-label={step1}>
            {step1}
          </DataList.Value>
        </DataList.Item>
        <DataList.Item>
          <DataList.Value tabIndex="0" aria-label={step2}>
            {step2}
          </DataList.Value>
        </DataList.Item>
      </DataList.Root>
    </Flex>
  );
};

export default function Header({ theme, setTheme }) {
  const [open, setOpen] = useState(false);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1,
        borderBottom: "1px solid var(--gray-5)",
      }}
    >
      <Flex align="center" justify="between" p="8px 16px">
        {/* Left: Site Name */}
        <Text size="4" weight="bold">
          Job Query Builder
        </Text>

        <Flex gap={"8px"}>
          <Popover.Root>
            <Popover.Trigger aria-label="About">
              <IconButton variant="surface">
                <QuestionMarkIcon height="14" width="14" />
              </IconButton>
            </Popover.Trigger>

            <Popover.Content size="1" maxWidth="375px" style={{ padding: 0 }}>
              <Flex
                justify={"end"}
                mb={"6px"}
                style={{
                  background: "var(--gray-1)",
                  borderBottom: "1px solid var(--gray-5)",
                  padding: "8px 16px",
                }}
              >
                <Popover.Close aria-label="Close">
                  <IconButton variant="ghost">
                    <Cross2Icon />
                  </IconButton>
                </Popover.Close>
              </Flex>

              <About />
            </Popover.Content>
          </Popover.Root>

          <Select.Root value={theme} onValueChange={setTheme}>
            <Select.Trigger placeholder="Theme" aria-label="Theme" />
            <Select.Content position="popper">
              <Select.Item value="dark">
                <Flex as="span" align="center" gap="2">
                  <MoonIcon /> Dark
                </Flex>
              </Select.Item>
              <Select.Item value="light">
                <Flex as="span" align="center" gap="2">
                  <SunIcon /> Light
                </Flex>
              </Select.Item>
            </Select.Content>
          </Select.Root>
        </Flex>
      </Flex>
    </header>
  );
}
