"use client";

import { Carousel, CarouselSlide } from "@mantine/carousel";
import { Box, Stack, Text, Image, Button, Grid, GridCol, Group } from "@mantine/core";
import { Content } from "@prismicio/client";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
// import { IconSearch } from "@tabler/icons-react";
import Autoplay from "embla-carousel-autoplay";
// import useEmblaCarousel, { EmblaOptionsType } from "embla-carousel-react";
import { useRef } from "react";

/**
 * Props for `LandingPage`.
 */
export type LandingPageProps = SliceComponentProps<Content.LandingPageSlice>;

/**
 * Component for "LandingPage" Slices.
 */
const LandingPage = ({ slice }: LandingPageProps): JSX.Element => {
    const autoplay = useRef(Autoplay({ delay: 950 }));
    return (
        <>
            <Box
                maw={{ base: 500, sm: 1024, lg: 1440 }}
                miw={{ base: 360, sm: 768, lg: 1200 }}
                m="auto"
                bg={"white"}
                // pt={{ base: 30, lg: 80 }}
            >
                <Grid
                    justify="center"
                    mx={{ base: 16, sm: 64, lg: 114 }}
                    gutter={{ base: 10, lg: 100 }}
                >
                    <GridCol span={{ base: 12, sm: 6, lg: 6 }}>
                        {" "}
                        <Stack pt={{ base: 30, lg: 70 }} gap={25}>
                            <PrismicRichText
                                field={slice.primary.title}
                                components={{
                                    heading1: ({ children }) => (
                                        <Text
                                            fz={{ base: 30, sm: 40, lg: 40 }}
                                            fw={"bold"}
                                            ff={"heading"}
                                            // w={600}
                                            // lh={1.5}
                                        >
                                            {children}
                                        </Text>
                                    ),
                                }}
                            />
                            <PrismicRichText
                                field={slice.primary.para}
                                components={{
                                    paragraph: ({ children }) => (
                                        <Text fz={{ base: 14, lg: 18 }} lh={2} c={"dimmed"}>
                                            {children}
                                        </Text>
                                    ),
                                }}
                            />
                            <PrismicNextLink field={slice.primary.navlink}>
                                <Button bg={"#209f9e"} w={150} h={50} mt={10}>
                                    Start Now
                                </Button>
                            </PrismicNextLink>
                            <Group wrap="nowrap" justify={"flex-start"} gap={30}>
                                {slice.primary.items.map((item, index) => (
                                    <Stack key={index} align="flex-start" gap={0}>
                                        <PrismicRichText
                                            field={item.numbers}
                                            components={{
                                                heading2: ({ children }) => (
                                                    <Text
                                                        fz={{ base: 22, lg: 44 }}
                                                        fw={700}
                                                        lh={"xs"}
                                                    >
                                                        {children}
                                                    </Text>
                                                ),
                                            }}
                                        />
                                        <PrismicRichText
                                            field={item.description}
                                            components={{
                                                paragraph: ({ children }) => (
                                                    <Text
                                                        fz={{ base: 14, lg: 18 }}
                                                        c={"#AFADB5"}
                                                        fw={500}
                                                    >
                                                        {children}
                                                    </Text>
                                                ),
                                            }}
                                        />
                                    </Stack>
                                ))}
                            </Group>
                        </Stack>
                    </GridCol>
                    <GridCol span={{ base: 12, sm: 6, lg: 6 }}>
                        <Carousel
                            slideSize={"100%"}
                            withControls={false}
                            withIndicators={false}
                            slideGap={5}
                            loop
                            align="start"
                            plugins={[autoplay.current]}
                            // onMouseEnter={autoplay.current.stop}
                            // onMouseLeave={autoplay.current.reset}
                        >
                            {slice.primary.bgimage.map((item, index) => (
                                <CarouselSlide key={index}>
                                    <Image
                                        h={500}
                                        mt={{ base: 20, sm: 50, lg: 100 }}
                                        field={item.bgimage}
                                        component={PrismicNextImage}
                                        src={item.bgimage.url}
                                        alt=""
                                        style={{
                                            backgroundSize: "cover",
                                            backgroundPosition: "center",
                                            height: "100vh",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            borderRadius: 30,
                                        }}
                                    />
                                </CarouselSlide>
                            ))}
                        </Carousel>
                    </GridCol>
                </Grid>
            </Box>
        </>
    );
};

export default LandingPage;
