import { Box, Grid, GridCol, Stack, Card, Text, Group } from "@mantine/core";
import { Content } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { IconPhone } from "@tabler/icons-react";

/**
 * Props for `AboutUsHeader`.
 */
export type AboutUsHeaderProps = SliceComponentProps<Content.AboutUsHeaderSlice>;

/**
 * Component for "AboutUsHeader" Slices.
 */
const AboutUsHeader = ({ slice }: AboutUsHeaderProps): JSX.Element => {
    return (
        <Box
            maw={{ base: 500, sm: 1024, lg: 1440 }}
            miw={{ base: 360, sm: 768, lg: 1200 }}
            m="auto"
            bg={"white"}
            pt={{ base: 100, lg: 50 }}
            // pb={{ base: 100, lg: 3 }}
        >
            <Stack align="center" gap={40} mx={{ lg: 144, sm: 64, base: 16 }}>
                <PrismicRichText field={slice.primary.heading} />
                <PrismicRichText field={slice.primary.paragraph} />
                <PrismicNextImage field={slice.primary.image} />
            </Stack>
            <Grid
                mx={{ base: 16, lg: 114 }}
                gutter={{ base: 10, lg: 50 }}
                mt={{ base: 20, sm: 48, lg: 64 }}
            >
                <GridCol span={{ base: 12, lg: "auto" }}>
                    <PrismicRichText field={slice.primary.subtitle} />
                    <PrismicRichText field={slice.primary.title} />
                    <Group wrap="nowrap" justify="flex-start" gap={30} mt={30}>
                        {slice.primary.items.map((item, index) => (
                            <Stack key={index} align="flex-start">
                                <PrismicRichText field={item.numbers} />
                                <PrismicRichText field={item.description} />
                            </Stack>
                        ))}
                    </Group>
                </GridCol>
                <GridCol span={{ base: 12, lg: "auto" }}>
                    <Group>
                        {slice.primary.stack.map((item, index) => (
                            <Stack key={index}>
                                <PrismicRichText field={item.quality} />
                                <PrismicRichText field={item.para} />
                            </Stack>
                        ))}
                    </Group>
                </GridCol>
            </Grid>
        </Box>
    );
};

export default AboutUsHeader;
