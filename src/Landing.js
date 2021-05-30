import React from 'react';
import {
  Button,
  Container,
  Heading,
  Box,
  Text,
  Link,
  SimpleGrid,
} from '@chakra-ui/react';

import {
  FcPrivacy,
  FcMoneyTransfer,
  FcLibrary,
  FcSupport,
} from 'react-icons/fc';
import { Feature } from './TwoByTwoFeatures/Feature';

function Landing() {
  return (
    <Container maxW={'3xl'}>
      <Box as="section">
        <Box
          maxW="2xl"
          mx="auto"
          px={{ base: '6', lg: '8' }}
          py={{ base: '16', sm: '20' }}
          textAlign="center"
        >
          <Heading
            as="h2"
            size="3xl"
            fontWeight="extrabold"
            letterSpacing="tight"
          >
            Host optimization contests on{' '}
            <Text as={'span'} color={'green.400'}>
              Optym
            </Text>
          </Heading>
          <Text mt="4" fontSize="lg">
            Optym helps you to deploy an optimization contest on blockchain in
            less than 5 minutes. Powered by{' '}
            <Link href="https://reach.sh" target="_blank">
              Reach Lang
            </Link>
            .
          </Text>
          <Button
            mt="8"
            as="a"
            href="/new"
            size="lg"
            colorScheme={'green'}
            fontWeight="bold"
          >
            Make a competition
          </Button>
        </Box>
      </Box>
      <Box
        as="section"
        maxW="5xl"
        mx="auto"
        py="12"
        px={{ base: '6', md: '8' }}
      >
        <SimpleGrid
          columns={{ base: 1, md: 2 }}
          spacingX="10"
          spacingY={{ base: '8', md: '14' }}
        >
          <Feature title="Secure by default" icon={<FcPrivacy />}>
            Both Funder and Contestant can be assured that their money goes to
            correct person, thanks to Smart Contracts.
          </Feature>
          <Feature title="Low Fees" icon={<FcMoneyTransfer />}>
            Other than the wager amount and network fees, we only charge 0.1% of
            the wager to hold a contest. This covers our deployment and server
            costs.
          </Feature>
          <Feature title="Open Source" icon={<FcLibrary />}>
            All the code for deployment is available on GitHub with an MIT
            License.
          </Feature>
          <Feature title="Easily Configurable" icon={<FcSupport />}>
            Challenge code and domains can be configured easily.
          </Feature>
        </SimpleGrid>
      </Box>
    </Container>
  );
}

export default Landing;
