import React, { useState } from 'react';
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  Stack,
  Container,
  Heading,
  Button,
  theme,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Flex,
  ButtonGroup,
  IconButton,
  Code,
} from '@chakra-ui/react';
import { FaGithub, FaCheck, FaTimes, FaEnvelope } from 'react-icons/fa';
import { Logo } from './Logo';
import NavBar from './NavBar';

function App() {
  const [isDomainAvailable] = useState(true);
  return (
    <ChakraProvider theme={theme}>
      <Box>
        <NavBar />
      </Box>
      <Box textAlign="center">
        <Container maxW={'3xl'}>
          <Stack
            as={Box}
            textAlign={'center'}
            spacing={{ base: 8, md: 14 }}
            py={{ base: 20, md: 16 }}
          >
            <Heading
              fontWeight={600}
              fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
              lineHeight={'110%'}
            >
              Fill this form to generate a new{' '}
              <Text as={'span'} color={'green.400'}>
                Optym
              </Text>{' '}
              contest
            </Heading>
            <form name="deploy" method="POST" data-netlify="true">
              <input type="hidden" name="form-name" value="deploy" />
              <Box textAlign="left">
                <FormControl id="name">
                  <FormLabel>Name</FormLabel>
                  <Input name="name" />
                </FormControl>
                <br />
                <FormControl id="email">
                  <FormLabel>Email address</FormLabel>
                  <Input type="email" name="email" />
                  <FormHelperText>
                    We'll never share your email. We will notify you once your
                    contest is deployed.
                  </FormHelperText>
                </FormControl>
                <br />
                <br />
                <FormControl id="deadline">
                  <FormLabel>Deadline (in UTC Time)</FormLabel>
                  <Flex>
                    <Input type="date" marginRight={5} name="date" />
                    <Input type="time" name="time" />
                  </Flex>
                  <FormHelperText>
                    Contestants need to submit solution before this deadline
                  </FormHelperText>
                </FormControl>
                <br />
                <Flex>
                  <FormControl id="wager" marginRight={5}>
                    <FormLabel>Wager Prize (in ETH)</FormLabel>
                    <Input type="float" name="wager" />
                    <FormHelperText>
                      Prize in ETH to give when someone wins the contest.
                    </FormHelperText>
                  </FormControl>
                  <FormControl id="domain">
                    <FormLabel>Domain</FormLabel>
                    <Flex textAlign="center" alignItems="center">
                      <Input
                        // type="input"
                        // w="35%"
                        mr={1}
                        textAlign="right"
                        name="domain"
                      ></Input>
                      <Text>.optym.tech</Text>
                      <Box mx={2}>
                        {isDomainAvailable && <FaCheck />}
                        {!isDomainAvailable && <FaTimes />}
                      </Box>
                    </Flex>
                  </FormControl>
                </Flex>
                <br />
                <FormControl id="challenge" marginRight={5}>
                  <FormLabel>Challenge File</FormLabel>
                  <Input type="file" name="code" />
                  <FormHelperText>
                    This should be a JS file with a single function{' '}
                    <Code>challenge</Code> which takes single input integer and
                    outputs single integer.
                  </FormHelperText>
                </FormControl>
                <br />
              </Box>
              <Button
                colorScheme={'green'}
                bg={'green.400'}
                fontSize={'sm'}
                fontWeight={600}
                //   rounded={'full'}
                _hover={{
                  bg: 'green.500',
                }}
                my={5}
                type="submit"
              >
                Pay and Submit
              </Button>
            </form>
          </Stack>
        </Container>
      </Box>
      {/* Footer */}
      <Box
        as="footer"
        role="contentinfo"
        mx="auto"
        maxW="7xl"
        py="12"
        px={{ base: '4', md: '8' }}
      >
        <Stack>
          <Stack
            direction="row"
            spacing="4"
            align="center"
            justify="space-between"
          >
            <Link href="https://optym.tech">
              <Logo />
            </Link>
            <ButtonGroup variant="ghost" color="gray.600">
              <IconButton
                as="a"
                href="https://github.com/kanav99/optym"
                target="_blank"
                aria-label="GitHub"
                icon={<FaGithub fontSize="20px" />}
              />
              <IconButton
                as="a"
                href="mailto:contact@optym.tech"
                icon={<FaEnvelope fontSize="20px" />}
              ></IconButton>
            </ButtonGroup>
          </Stack>
          <Text fontSize="sm" alignSelf={{ base: 'center', sm: 'start' }}>
            &copy; {new Date().getFullYear()} Optym. All rights reserved.
          </Text>
        </Stack>
      </Box>
    </ChakraProvider>
  );
}

export default App;
