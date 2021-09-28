/* eslint-disable react/no-children-prop */
import { useAtom, atom } from "jotai";
import React from "react";
import { AiFillGithub } from "react-icons/ai";
import useSWR, { mutate } from "swr";
import {
  useToast,
  useDisclosure,
  useColorMode,
  Table,
  Thead,
  Tbody,
  Tooltip,
  Tr,
  Flex,
  Th,
  Td,
  Link,
  Spinner,
  InputRightElement,
  Button,
  Box,
  Text,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
} from "@chakra-ui/react";
import { Input, InputGroup } from "@chakra-ui/react";
const subAtom = atom("");
const domainAtom = atom("");
const secretAtom = atom("");
export default function Test() {
  const { colorMode, toggleColorMode } = useColorMode();
  const toast = useToast();
  const [domain, setdomain] = useAtom(domainAtom);
  const [secret, setsecret] = useAtom(secretAtom);
  const [hasMounted, setHasMounted] = React.useState(false);
  const [suburl, setsuburl] = useAtom(subAtom);
  const { data } = useSWR(`https://${domain}/${secret}/feeds`);
  React.useEffect(() => {
    setdomain(location.host)
    setsecret(location.pathname.substring(1))
    setHasMounted(true);
  }, [setdomain, setsecret]);
  const handledelete = async (e) => {
    e.preventDefault();
    let url = e.currentTarget.getAttribute("url");
    const res = await fetch(`https://${domain}/${secret}/deleteitem`, {
      method: "post",
      body: JSON.stringify({ url: url }),
    })
      .then((r) => r.json())
      .then((r) => {
        if (r.status != 0) {
          toast({
            position: "bottom-right",
            title: "Error!",
            description: r.message,
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        } else {
          toast({
            position: "bottom-right",
            title: "Delete succeed!",
            description: r.message,
            status: "success",
            duration: 1000,
            isClosable: true,
          });
        }
      });
    mutate(`https://${domain}/${secret}/feeds`);
  };
  const handlesub = async (e) => {
    e.preventDefault();
    const res = await fetch(`https://${domain}/${secret}/subitem`, {
      method: "post",
      body: JSON.stringify({ url: suburl }),
    })
      .then((r) => r.json())
      .then((r) => {
        if (r.status != 0) {
          toast({
            position: "bottom-right",
            title: "Error!",
            description: r.message,
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        } else {
          toast({
            position: "bottom-right",
            title: "Success!",
            description: r.message,
            status: "success",
            duration: 1000,
            isClosable: true,
          });
        }
      });
    mutate(`https://${domain}/${secret}/feeds`);
  };
  const handleActive = async (e) => {
    e.preventDefault();
    console.log(e.currentTarget.getAttribute("state"));
    const res = await fetch(`https://${domain}/${secret}/active`, {
      method: "POST",
      body: JSON.stringify({
        url: e.currentTarget.getAttribute("url"),
        state: e.currentTarget.getAttribute("state") === "on" ? false : true,
      }),
    })
      .then((r) => r.json())
      .then((r) => {
        if (r.status != 0) {
          toast({
            position: "bottom-right",
            title: "Error!",
            description: r.message,
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        } else {
          toast({
            position: "bottom-right",
            title: "succeed!",
            description: r.message,
            status: "success",
            duration: 1000,
            isClosable: true,
          });
        }
      });
    mutate(`https://${domain}/${secret}/feeds`);
  };
  const handleTelegraph = async (e) => {
    e.preventDefault();
    console.log(e.currentTarget.getAttribute("state"));
    const res = await fetch(`https://${domain}/${secret}/telegraph`, {
      method: "POST",
      body: JSON.stringify({
        url: e.currentTarget.getAttribute("url"),
        state: e.currentTarget.getAttribute("state") === "on" ? false : true,
      }),
    })
      .then((r) => r.json())
      .then((r) => {
        if (r.status != 0) {
          toast({
            position: "bottom-right",
            title: "Error!",
            description: r.message,
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        } else {
          toast({
            position: "bottom-right",
            title: "succeed!",
            description: r.message,
            status: "success",
            duration: 1000,
            isClosable: true,
          });
        }
      });
    mutate(`https://${domain}/${secret}/feeds`);
  };
  if (!data || !hasMounted) {
    return (
      <Box w="100%" align="center">
        <Spinner size="xl" my="80" />
      </Box>
    );
  }
  return (
    <>
      <Box w="md" maxW="100%" mx="auto" my="10">
        <Box>
          <Text fontSize="5xl" fontWeight="bold" align="center">
            Sub Lists
          </Text>
          <Text align="center" fontSize="2xl" fontWeight="bold">
            Subscribe!
          </Text>
          <InputGroup size="md" my="2">
            <Input
              focusBorderColor={colorMode === "light" ? "black" : "white"}
              pr="4.5rem"
              value={suburl}
              placeholder="Enter Url"
              onChange={(e) => setsuburl(e.target.value)}
            />
            <InputRightElement width="4.5rem">
              <Button
                h="1.75rem"
                size="sm"
                onClick={handlesub}
                variant="outline"
                colorScheme="black"
              >
                Subscribe
              </Button>
            </InputRightElement>
          </InputGroup>
          <Text align="center" fontSize="2xl">
            {data.length} items
          </Text>
          <Table size="xs">
            <Thead>
              <Tr>
                <Th>active</Th>
                <Th>title</Th>
                <Tooltip label="telegraph" placement="auto">
                  <Th>TG</Th>
                </Tooltip>
                <Th>delete</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.map((feed) => (
                <Tr key={feed.title}>
                  <Td>
                    <Tooltip label="Click to change!" placement="auto">
                      <Button
                        url={feed.url}
                        state={feed.active ? "on" : "off"}
                        variant="ghost"
                        isChecked={feed.active}
                        onClick={handleActive}
                      >
                        <Box
                          w="2"
                          h="2"
                          border="1px"
                          bg={
                            feed.active
                              ? colorMode === "light"
                                ? "black"
                                : "white"
                              : "transparent"
                          }
                          borderRadius="full"
                        ></Box>
                      </Button>
                    </Tooltip>
                  </Td>
                  <Td>
                    <Link href={feed.url}>{feed.title}</Link>
                  </Td>

                  <Td>
                    <Tooltip label="Click to change!" placement="auto">
                      <Button
                        url={feed.url}
                        state={feed.telegraph ? "on" : "off"}
                        variant="ghost"
                        isChecked={feed.telegraph}
                        onClick={handleTelegraph}
                      >
                        <Box
                          w="2"
                          h="2"
                          border="1px"
                          bg={feed.telegraph
                            ? colorMode === "light"
                              ? "black"
                              : "white"
                            : "transparent"}
                          borderRadius="full"
                        ></Box>
                      </Button>
                    </Tooltip>
                  </Td>
                  <Td>
                    <Popover placement="top-start" colorScheme="black">
                      <PopoverTrigger>
                        <Button variant="ghost" size="sm">
                          Delete
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent boxShadow="black">
                        <PopoverHeader fontWeight="semibold">
                          Be careful!
                        </PopoverHeader>
                        <PopoverArrow />
                        <PopoverCloseButton />
                        <PopoverBody align="center">
                          <Text>{"Delete " + feed.title + " ?"}</Text>
                          <Button
                            my="2"
                            variant="outline"
                            size="sm"
                            borderColor="black"
                            url={feed.url}
                            onClick={handledelete}
                          >
                            Confirm!
                          </Button>
                        </PopoverBody>
                      </PopoverContent>
                    </Popover>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Box>
      <footer>
        <Flex
          mt="100px"
          borderTop="1px"
          mx="auto"
          justify="flex-end"
          px={8}
          py={4}
          width="100%"
          maxWidth="md"
        >
          <Link href="https://github.com/pureink/inkrss" isExternal>
            <Button variant="ghost" size="sm" rightIcon={<AiFillGithub />}>
              GitHub
            </Button>
          </Link>
        </Flex>
      </footer>
    </>
  );
}
