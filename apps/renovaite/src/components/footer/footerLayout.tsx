import { Box } from "@mantine/core";
import React from "react";

const FooterLayout = ({ children }: { children: React.ReactNode }) => {
    return <Box px={64}>{children}</Box>;
};

export default FooterLayout;
