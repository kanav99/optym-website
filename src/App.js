import {
  ChakraProvider,
  Box,
  Text,
  Link,
  Stack,
  theme,
  ButtonGroup,
  IconButton,
} from '@chakra-ui/react';
import { FaGithub, FaEnvelope } from 'react-icons/fa';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Logo } from './Logo';
import NavBar from './NavBar';

import Form from './Form';
import Landing from './Landing';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Box>
        <NavBar />
      </Box>
      <Router>
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/new">
            <Form />
          </Route>

          <Route path="/">
            <Landing />
          </Route>
        </Switch>
      </Router>
      {/* <Form /> */}
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
                href="https://github.com/optymtech/optym"
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
