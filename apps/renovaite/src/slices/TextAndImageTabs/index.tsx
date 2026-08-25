"use client";
import { Box, Button, Grid, GridCol, Group, Image, Slider, Stack, Text } from "@mantine/core";
import { Content } from "@prismicio/client";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { IconCodeCircle } from "@tabler/icons-react";
import { useState } from "react";

/**
 * Props for `TextAndImageTabs`.
 */
export type TextAndImageTabsProps = SliceComponentProps<Content.TextAndImageTabsSlice>;

/**
 * Component for "TextAndImageTabs" Slices.
 */
const TextAndImageTabs = ({ slice }: TextAndImageTabsProps): JSX.Element => {
    const [sliderPosition, setSliderPosition] = useState(50);
    return (
        // <Box
        //     maw={{ base: 500, sm: 1024, lg: 1440 }}
        //     miw={{ base: 360, sm: 768, lg: 1200 }}
        //     m="auto"
        //     bg={"white"}
        //     pt={{ base: 50, lg: 180 }}
        // >
        //     <Grid mx={{ base: 16, lg: 114 }} gutter={{ base: 10, lg: 50 }}>
        //         <GridCol
        //             span={{ base: 12, sm: 6, lg: "auto" }}
        //             // order={{ lg: 1, sm: 2, base: 2 }}
        //         >
        //             <Stack gap={0}>
        //                 <PrismicRichText
        //                     field={slice.primary.title}
        //                     components={{
        //                         heading5: ({ children }) => (
        //                             <Text fw={700} fz={{ base: 14, lg: 18 }} c={"#FFB23F"}>
        //                                 {children}
        //                             </Text>
        //                         ),
        //                     }}
        //                 />
        //                 <PrismicRichText
        //                     field={slice.primary.subtitle}
        //                     components={{
        //                         heading2: ({ children }) => (
        //                             <Text
        //                                 fz={{ base: 24, lg: 44 }}
        //                                 fw={700}
        //                                 lh={"xs"}
        //                                 mt={{ base: 8, lg: 14 }}
        //                             >
        //                                 {children}
        //                             </Text>
        //                         ),
        //                     }}
        //                 />
        //                 <PrismicRichText
        //                     field={slice.primary.para}
        //                     components={{
        //                         paragraph: ({ children }) => (
        //                             <Text c={"#AFADB5"} fw={500} mt={{ base: 16, lg: 30 }}>
        //                                 {children}
        //                             </Text>
        //                         ),
        //                     }}
        //                 />
        //                 <PrismicNextLink field={slice.primary.navlink}>
        //                     <Button w={170} h={54} bg={"#518581"} mt={30} fz={18} visibleFrom="sm">
        //                         Learn more
        //                     </Button>
        //                     <Button h={54} bg={"#518581"} mt={30} fz={18} hiddenFrom="sm">
        //                         Learn more
        //                     </Button>
        //                 </PrismicNextLink>

        //                 <Group wrap="nowrap" justify="flex-start" gap={30} mt={30}>
        //                     {slice.primary.items.map((item, index) => (
        //                         <Stack key={index} align="flex-start">
        //                             <PrismicRichText
        //                                 field={item.numbers}
        //                                 components={{
        //                                     heading2: ({ children }) => (
        //                                         <Text fz={{ base: 22, lg: 44 }} fw={700} lh={"xs"}>
        //                                             {children}
        //                                         </Text>
        //                                     ),
        //                                 }}
        //                             />
        //                             <PrismicRichText
        //                                 field={item.description}
        //                                 components={{
        //                                     paragraph: ({ children }) => (
        //                                         <Text
        //                                             fz={{ base: 14, lg: 18 }}
        //                                             c={"#AFADB5"}
        //                                             fw={500}
        //                                         >
        //                                             {children}
        //                                         </Text>
        //                                     ),
        //                                 }}
        //                             />
        //                         </Stack>
        //                     ))}
        //                 </Group>
        //             </Stack>
        //         </GridCol>
        //         <GridCol
        //             span={{ base: 12, sm: 12, lg: "content" }}
        //             // order={{ lg: 2, base: 1, sm: 1 }}
        //             w={{ base: 400, sm: 450, lg: 720 }}
        //         >
        //             <Box
        //                 h={{ base: 280, sm: 350, lg: 550 }}
        //                 mt={{ base: 15 }}
        //                 style={{
        //                     position: "relative",
        //                     zIndex: 2,
        //                 }}
        //             >
        //                 <Image
        //                     alt=""
        //                     // w={{ base: 400, lg: 594 }}
        //                     src={slice.primary.bgimage.url}
        //                     component={PrismicNextImage}
        //                     field={slice.primary.bgimage}
        //                     // h={{ base: 200, lg: 510 }}
        //                     style={{
        //                         top: 0,
        //                         right: 0,
        //                         position: "absolute",
        //                         zIndex: -1,
        //                         width: "100%",
        //                         height: "100%",
        //                         borderRadius: 30,
        //                         // objectFit: "cover",
        //                     }}
        //                 />
        //                 <Image
        //                     // w={{ base: 400, lg: 594 }}
        //                     alt=""
        //                     pos={"relative"}
        //                     src={slice.primary.image.url}
        //                     component={PrismicNextImage}
        //                     field={slice.primary.image}
        //                     // h={{ base: 200, lg: 510 }}
        //                     style={{
        //                         position: "absolute",
        //                         top: 0,
        //                         right: 0,
        //                         width: "100%",
        //                         height: "100%",
        //                         objectFit: "cover",
        //                         borderRadius: 30,
        //                         clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
        //                     }}
        //                 />
        //                 <Slider
        //                     color="#518581"
        //                     label={null}
        //                     thumbChildren={<IconCodeCircle size={"15rem"} />}
        //                     thumbSize={32}
        //                     value={sliderPosition}
        //                     onChange={(value) => setSliderPosition(value)}
        //                     style={{
        //                         position: "absolute",
        //                         top: "50%",
        //                         transform: "translateY(-50%)",
        //                         width: "100%",
        //                         zIndex: 1,
        //                     }}
        //                     styles={{
        //                         track: {
        //                             height: 0.00001,
        //                         },
        //                     }}
        //                 />
        //             </Box>
        //         </GridCol>
        //     </Grid>
        // </Box>

        <></>
    );
};

export default TextAndImageTabs;
