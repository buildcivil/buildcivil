import { Stack, Divider, Text } from "@mantine/core";
import { Content } from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";

/**
 * Props for `MobileNavbr`.
 */
export type MobileNavbrProps = SliceComponentProps<Content.MobileNavbrSlice>;

/**
 * Component for "MobileNavbr" Slices.
 */
const MobileNavbr = ({ slice }: MobileNavbrProps): JSX.Element => {
    return (
        <Stack mt={22} mx={24}>
            <PrismicNextLink field={slice.primary.navlink}>
                <PrismicRichText
                    field={slice.primary.name}
                    components={{
                        paragraph: ({ children }) => (
                            <Text c={"#292929"}>{children}</Text>
                        ),
                    }}
                ></PrismicRichText>
                <Divider size={"sm"} mt={22} />
            </PrismicNextLink>
        </Stack>
    );
};

export default MobileNavbr;
