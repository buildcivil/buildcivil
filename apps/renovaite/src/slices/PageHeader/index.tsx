import { Box, Text } from "@mantine/core";
import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";

/**
 * Props for `PageHeader`.
 */
export type PageHeaderProps = SliceComponentProps<Content.PageHeaderSlice>;

/**
 * Component for "PageHeader" Slices.
 */
const PageHeader = ({ slice }: PageHeaderProps): JSX.Element => {
    return (
        <Box
            maw={{ base: 500, sm: 1024, lg: 1440 }}
            miw={{ base: 360, sm: 768, lg: 1200 }}
            m="auto"
            bg={"white"}
            pt={{ base: 30, lg: 60 }}
        >
            <PrismicRichText
                field={slice.primary.title}
                components={{
                    heading2: ({ children }) => (
                        <Text
                            fz={{ base: 24, lg: 44 }}
                            fw={700}
                            ta={"center"}
                            mx={{ lg: 144, base: 16 }}
                        >
                            {children}
                        </Text>
                    ),
                }}
            />
            <PrismicRichText
                field={slice.primary.subtitle}
                components={{
                    paragraph: ({ children }) => (
                        <Text
                            mt={{ base: 18, lg: 18 }}
                            c={"#AFADB5"}
                            ta={"center"}
                            mx={{ base: 16, lg: 144 }}
                        >
                            {children}
                        </Text>
                    ),
                }}
            />
        </Box>
    );
};

export default PageHeader;
