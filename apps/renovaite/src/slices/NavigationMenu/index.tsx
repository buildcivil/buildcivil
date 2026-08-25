// import { CustomText } from "@/components/custom-components/custom-text";
// import { customBody1, customBody2 } from "@/components/custom-components/custom-text.css";
import { Text } from "@mantine/core";
import { Content } from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
// import { useState } from "react";

/**
 * Props for `NavigationMenu`.
 */
export type NavigationMenuProps = SliceComponentProps<Content.NavigationMenuSlice>;

/**
 * Component for "NavigationMenu" Slices.
 */
const NavigationMenu = ({ slice }: NavigationMenuProps): JSX.Element => {
    return (
        <PrismicNextLink field={slice.primary.link}>
            <PrismicRichText
                field={slice.primary.name}
                components={{
                    paragraph: ({ children }) => <Text>{children}</Text>,
                }}
            ></PrismicRichText>
        </PrismicNextLink>
    );
};

export default NavigationMenu;
