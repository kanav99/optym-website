import React, { useState } from 'react';
import {
  Box,
  Text,
  Stack,
  Container,
  Heading,
  Button,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Flex,
  Code,
  useColorModeValue,
  InputGroup,
  InputRightAddon,
  InputLeftAddon,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  VStack,
  HStack,
} from '@chakra-ui/react';
import { loadStdlib } from '@reach-sh/stdlib';
import { FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';
import './spinner.css';

import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-tomorrow.css';

const stdlib = loadStdlib('ETH');

const DOMAIN_NULL = 0;
const DOMAIN_LOAD = 1;
const DOMAIN_YES = 2;
const DOMAIN_NO = 3;

function wait(ms = 1000) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

const Funder = (Who, funderParams) => ({
  // ...Common,
  getBounty: () => {
    return funderParams;
  },
  informBounty: (bountyAmt, deadline) => {
    console.log(`${Who} saw a bounty of ${bountyAmt} and deadline ${deadline}`);
  },
  informLeaderboard: leaderboard => {
    leaderboard.forEach((element, i) => {
      console.log(
        `${i}: ${element.accountAddress} ${element.returnValue} ${element.inputValue} ${element.timestamp}`
      );
    });
  },
});

function Form() {
  const [domainStatus, setDomainStatus] = useState(DOMAIN_NULL);
  const [code, setCode] = useState(
    `'reach 0.1';\n\nexport function bountyFunction(i) {\n  return - i * i + 4 * i + 17;\n}\n`
  );

  const steps = [
    'Creating compile job',
    'Waiting for compilation to complete',
    'Deploying on the blockchain',
    'Requesting Wager',
  ];
  const [deployStep, setDeployStep] = useState(0);
  const [domainTimer, setDomainTimer] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSubmit = event => {
    event.preventDefault();

    let myForm = document.getElementById('deploy');
    let formData = new FormData(myForm);
    var object = {};
    formData.forEach(function (value, key) {
      object[key] = value;
    });
    object.code = code;
    var json = JSON.stringify(object);

    onOpen();
    fetch('/.netlify/functions/reachCompile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: json,
    })
      .then(async response => {
        return response.json();
      })
      .then(async response => {
        setDeployStep(1);
        console.log(`Poll ${response.pollId}`);

        var module_content = '';
        while (true) {
          await wait(2000);
          const response = await fetch(`/.netlify/functions/compilationDone`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ domain: object.domain }),
          });
          if (response.ok) {
            const obj = await response.json();
            if (obj.complete) {
              module_content = obj.content;
              setDeployStep(2);
              break;
            } else {
              continue;
            }
          } else {
            continue;
          }
        }

        const backend = await import(
          /* webpackIgnore: true */ 'data:text/javascript;base64,' +
            module_content
        );
        const funderAccount = await stdlib.getDefaultAccount();
        console.log(JSON.stringify(funderAccount));
        const ctcFunder = funderAccount.deploy(backend);
        const ctcInfo = await ctcFunder.getInfo();
        console.log(JSON.stringify(ctcInfo));

        setDeployStep(3);

        const funderParams = {
          amt: stdlib.parseCurrency(object.wager),
          deadline: 1000000,
        };

        backend.Funder(ctcFunder, Funder('GuputaSan', funderParams));

        const siteConfig = {
          // in epoch seconds
          endingTime: 1622374200,
          funderName: object.name,
          wager: object.wager,
          funderWallet: funderAccount.networkAccount.address,
          contractAddress: ctcInfo.address,
          ctcstring: JSON.stringify(ctcInfo),
          code: object.code,
        };

        console.log(JSON.stringify(siteConfig));

        const responseDeploy = await fetch(`/.netlify/functions/deploySite`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ domain: object.domain, siteConfig }),
        });

        alert(responseDeploy.status);

        // .then(() => {
        //   alert('deploy done sir');
        // });
      })
      .catch(error => alert(JSON.stringify(error)));
  };

  return (
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
          <form
            name="deploy"
            id="deploy"
            method="POST"
            data-netlify="true"
            onSubmit={handleSubmit}
          >
            <input type="hidden" name="form-name" value="deploy" />
            <Box textAlign="left">
              <FormControl id="name" isRequired>
                <FormLabel>Name</FormLabel>
                <Input name="name" />
              </FormControl>
              <br />
              <FormControl id="email" isRequired>
                <FormLabel>Email address</FormLabel>
                <Input type="email" name="email" />
                <FormHelperText>
                  We'll never share your email. We will notify you once your
                  contest is deployed.
                </FormHelperText>
              </FormControl>
              <br />
              <br />
              <FormControl id="deadline" isRequired>
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
                <FormControl id="wager" marginRight={5} isRequired>
                  <FormLabel>Wager Prize (in ETH)</FormLabel>
                  {/* <Input type="float" name="wager" /> */}
                  <NumberInput defaultValue={1} precision={3} step={0.001}>
                    <NumberInputField name="wager" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <FormHelperText>
                    Prize in ETH to give when someone wins the contest.
                  </FormHelperText>
                </FormControl>
                <FormControl id="domain" isRequired>
                  <FormLabel>Domain</FormLabel>
                  <Flex textAlign="center" alignItems="center">
                    <InputGroup>
                      <InputLeftAddon children="https://" />
                      <Input
                        // type="input"
                        // w="35%"
                        textAlign="right"
                        name="domain"
                        onChange={event => {
                          const domain = event.target.value;
                          if (domainTimer) {
                            clearTimeout(domainTimer);
                          }
                          let to = setTimeout(() => {
                            setDomainStatus(DOMAIN_LOAD);
                            fetch(
                              '/.netlify/functions/domainAvailable?domain=' +
                                domain
                            )
                              .then(res => {
                                // console.log(res.text());
                                return res.json();
                              })
                              .then(res => {
                                console.log(res);
                                setDomainStatus(
                                  res.available ? DOMAIN_YES : DOMAIN_NO
                                );
                              });
                          }, 1000);
                          setDomainTimer(to);
                        }}
                      />
                      <InputRightAddon children=".optym.tech" />
                    </InputGroup>
                    {/* <Text>.optym.tech</Text> */}
                    <Box mx={2}>
                      {domainStatus === DOMAIN_YES && <FaCheck />}
                      {domainStatus === DOMAIN_NO ||
                        (domainStatus === DOMAIN_NULL && <FaTimes />)}
                      {domainStatus === DOMAIN_LOAD && (
                        <FaSpinner className="icon-spin" />
                      )}
                    </Box>
                  </Flex>
                </FormControl>
              </Flex>
              <br />
              <FormControl id="challenge" marginRight={5} isRequired>
                <FormLabel>Challenge Function</FormLabel>
                <Input name="code" value={code} hidden />
                <Editor
                  value={code}
                  onValueChange={code => setCode(code)}
                  highlight={code => highlight(code, languages.js)}
                  padding={10}
                  style={{
                    fontFamily: '"Fira code", "Fira Mono", monospace',
                    fontSize: 14,
                    borderWidth: 1,
                    borderStyle: 'solid',
                    borderColor: useColorModeValue('gray.200', 'gray.700'),
                  }}
                />
                <FormHelperText>
                  This should be a reach function <Code>bountyFunction</Code>{' '}
                  which takes single input integer and outputs single integer.
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
              isDisabled={!(domainStatus === DOMAIN_YES)}
            >
              Pay and Submit
            </Button>
          </form>
        </Stack>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Deploying 🚀</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack>
                <HStack>
                  {<FaSpinner className="icon-spin" />}
                  <Text>{steps[deployStep]}</Text>
                </HStack>
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                Close
              </Button>
              {/* <Button variant="ghost">Secondary Action</Button> */}
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Container>
    </Box>
  );
}

export default Form;
