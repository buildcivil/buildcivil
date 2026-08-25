import { Box, Image, Stack } from "@mantine/core";
import { Content } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import { SliceComponentProps } from "@prismicio/react";

/**
 * Props for `FramesImage`.
 */
export type FramesImageProps = SliceComponentProps<Content.FramesImageSlice>;

/**
 * Component for "FramesImage" Slices.
 */
const FramesImage = ({ slice }: FramesImageProps): JSX.Element => {
    return (
        <Box
            maw={{ base: 500, sm: 1024, lg: 1440 }}
            miw={{ base: 360, sm: 768, lg: 1200 }}
            m="auto"
            bg={"white"}
            pt={{ base: 50, lg: 100 }}
        >
            <Stack align="center">
                <Box visibleFrom="sm">
                    <PrismicNextImage
                        field={slice.primary.image}
                        height={510}
                    />
                </Box>
            </Stack>
            {/* <Image
                src={slice.primary.image.url}
                mt={{ base: 20, sm: 50, lg: 100 }}
                h={510}
                component={PrismicNextImage}
                field={slice.primary.image}
            /> */}
        </Box>
    );
};

export default FramesImage;
