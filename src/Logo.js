import { Image, Text, Flex } from '@chakra-ui/react';

export const Logo = props => {
  return (
    <Flex alignItems="center">
      <Image src="simplex.png" h={10}></Image>
      <Text px={2} paddingTop={1} as="b" fontSize={20}>
        Optym
      </Text>
    </Flex>
  );
};
