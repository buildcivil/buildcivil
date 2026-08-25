import { Box, Grid, GridCol, Stack, Text } from "@mantine/core";
import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";

/**
 * Props for `Grid3X3`.
 */
export type Grid3X3Props = SliceComponentProps<Content.Grid3X3Slice>;

/**
 * Component for "Grid3X3" Slices.
 */
const Grid3X3 = ({ slice }: Grid3X3Props): JSX.Element => {
    return (
        <Box
            maw={{ base: 500, sm: 1024, lg: 1440 }}
            miw={{ base: 360, sm: 768, lg: 1200 }}
            m="auto"
            bg={"white"}
            pt={{ base: 100, lg: 50 }}
            pb={{ base: 100, lg: 180 }}
        >
            <Grid mx={{ base: 16, lg: 114 }} gutter={{ base: 10, lg: 50 }}>
                {slice.primary.stack.map((item, index) => (
                    <GridCol span={4} key={index}>
                        <Stack>
                            <PrismicRichText
                                field={item.number}
                                components={{
                                    heading1: ({ children }) => (
                                        <Text c={"#209F9E"} fw={700} fz={{ base: 64, lg: 32 }}>
                                            {children}
                                        </Text>
                                    ),
                                }}
                            />
                            <PrismicRichText field={item.title} />
                            <PrismicRichText field={item.para} />
                        </Stack>
                    </GridCol>
                ))}
            </Grid>
        </Box>
    );
};

export default Grid3X3;
