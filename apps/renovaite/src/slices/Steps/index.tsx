import { Box, Card, Grid, GridCol, SimpleGrid, Stack, Text } from "@mantine/core";
import { Content } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";

/**
 * Props for `Steps`.
 */
export type StepsProps = SliceComponentProps<Content.StepsSlice>;

/**
 * Component for "Steps" Slices.
 */
const Steps = ({ slice }: StepsProps): JSX.Element => {
    return (
        <Box
            maw={{ base: 500, sm: 1024, lg: 1440 }}
            miw={{ base: 360, sm: 768, lg: 1200 }}
            m="auto"
            bg={"white"}
            pt={{ base: 50, lg: 100 }}
        >
            <Stack align="center" gap={30}>
                <PrismicRichText
                    field={slice.primary.title}
                    components={{
                        heading1: ({ children }) => (
                            <Text fz={{ base: 30, lg: 44 }} fw={700} ta={"center"}>
                                {children}
                            </Text>
                        ),
                    }}
                />

                <SimpleGrid cols={{ base: 2, sm: 1, lg: 1 }} spacing={"xs"}>
                    <div>
                        {slice.primary.images.map((item, index) => (
                            <PrismicNextImage field={item.image} key={index} />
                        ))}
                    </div>
                </SimpleGrid>
                <PrismicRichText
                    field={slice.primary.subtitle}
                    components={{
                        heading1: ({ children }) => (
                            <Text
                                fz={{ base: 30, lg: 44 }}
                                mt={{ base: 25, sm: 30, lg: 40 }}
                                fw={700}
                                ta={"center"}
                            >
                                {children}
                            </Text>
                        ),
                    }}
                />
                <Grid
                    mx={{ base: 16, lg: 114 }}
                    mt={{ base: 10, lg: 20 }}
                    align="center"
                    justify="center"
                >
                    {slice.primary.steps.map((item, index) => (
                        <GridCol span={{ base: 12, lg: 4 }} key={index}>
                            <Card
                                h={{ lg: 286 }}
                                shadow="lg"
                                bg={"#FFF"}
                                p={24}
                                style={{ border: "2px solid #f7f7f7" }}
                            >
                                <Stack>
                                    <PrismicRichText
                                        field={item.heading}
                                        components={{
                                            heading1: ({ children }) => (
                                                <Text
                                                    fz={{ base: 30, lg: 44 }}
                                                    fw={700}
                                                    ta={"center"}
                                                >
                                                    {children}
                                                </Text>
                                            ),
                                        }}
                                    />
                                    <PrismicRichText
                                        field={item.para}
                                        components={{
                                            paragraph: ({ children }) => (
                                                <Text mt={{ base: 0, lg: 53 }} c={"#AFADB5"}>
                                                    {children}
                                                </Text>
                                            ),
                                        }}
                                    />
                                </Stack>
                            </Card>
                        </GridCol>
                    ))}
                </Grid>
            </Stack>
        </Box>
    );
};

export default Steps;
