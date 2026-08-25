"use client";

import { createTheme, rem } from "@mantine/core";
import { themeToVars } from "@mantine/vanilla-extract";
export const theme = createTheme({
    fontFamily: "Open Sans, sans-serif",
    fontFamilyMonospace: "monospace",
    headings: {
        fontFamily: "Open Sans, sans-serif",
        sizes: {
            h1: { fontWeight: "600" },
            h2: { fontWeight: "600" },
            h3: { fontWeight: "400" },
            h4: { fontWeight: "600" },
            h5: { fontWeight: "400" },
            h6: { fontWeight: "600" },
        },
    },

    fontSizes: {
        xs: rem(12),
        sm: rem(14),
        lg: rem(16),
    },
});
export const vars = themeToVars(theme);
