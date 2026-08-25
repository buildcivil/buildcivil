"use client";
import { Box, Grid, GridCol, Stack, Button, Group, Slider, Text, Image } from "@mantine/core";
import { Content } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { IconCodeCircle } from "@tabler/icons-react";
import { useState } from "react";

/**
 * Props for `HeroSlider`.
 */
export type HeroSliderProps = SliceComponentProps<Content.HeroSliderSlice>;

/**
 * Component for "HeroSlider" Slices.
 */
const HeroSlider = ({ slice }: HeroSliderProps): JSX.Element => {
    const [sliderPosition, setSliderPosition] = useState(50);

    return (
        <Box
            maw={{ base: 500, sm: 1024, lg: 1440 }}
            miw={{ base: 360, sm: 768, lg: 1200 }}
            m="auto"
            bg={"white"}
            pt={{ base: 50, lg: 100 }}
        >
            <Grid mx={{ base: 16, sm: 64, lg: 114 }} gutter={{ base: 10, sm: 50, lg: 100 }} mt={80}>
                <GridCol
                    span={{ base: 12, sm: 6, lg: "auto" }}
                    order={{ lg: slice.variation === "default" ? 1 : 2 }}
                >
                    <Stack gap={0}>
                        <PrismicRichText
                            field={slice.primary.title}
                            components={{
                                heading2: ({ children }) => (
                                    <Text
                                        fz={{ base: 28, lg: 34 }}
                                        fw={700}
                                        lh={"xs"}
                                        mt={{ base: 8, lg: 64 }}
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
                                    <Text c={"#AFADB5"} fw={500} mt={{ base: 16, lg: 30 }}>
                                        {children}
                                    </Text>
                                ),
                            }}
                        />
                    </Stack>
                </GridCol>
                <GridCol
                    span={{ base: 12, lg: "content" }}
                    order={{ lg: slice.variation === "default" ? 2 : 1 }}
                    w={{ base: 400, sm: 450, lg: 720 }}
                >
                    <Box
                        h={{ base: 280, sm: 300, lg: 350 }}
                        mt={{ base: 15 }}
                        style={{
                            position: "relative",
                            zIndex: 2,
                        }}
                    >
                        <Image
                            alt=""
                            // w={{ base: 400, lg: 594 }}
                            src={slice.primary.bgimage.url}
                            component={PrismicNextImage}
                            field={slice.primary.bgimage}
                            h={{ base: 200, lg: 350 }}
                            style={{
                                top: 0,
                                right: 0,
                                position: "absolute",
                                zIndex: -1,
                                width: "100%",
                                height: "100%",
                                borderRadius: 30,

                                // objectFit: "cover",
                            }}
                        />
                        <Image
                            // w={{ base: 400, lg: 594 }}
                            alt=""
                            pos={"relative"}
                            src={slice.primary.image.url}
                            component={PrismicNextImage}
                            field={slice.primary.image}
                            h={{ base: 200, lg: 350 }}
                            style={{
                                position: "absolute",
                                top: 0,
                                right: 0,
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                borderRadius: 30,
                                clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
                            }}
                        />
                        <Slider
                            color="#518581"
                            label={null}
                            thumbChildren={<IconCodeCircle size={"15rem"} />}
                            thumbSize={50}
                            value={sliderPosition}
                            onChange={(value) => setSliderPosition(value)}
                            style={{
                                position: "absolute",
                                top: "50%",
                                transform: "translateY(-50%)",
                                width: "100%",
                                zIndex: 1,
                            }}
                            styles={{
                                track: {
                                    height: 0.00001,
                                },
                            }}
                        />
                    </Box>
                </GridCol>
            </Grid>
        </Box>
    );
};

export default HeroSlider;
