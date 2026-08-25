"use client";
import { AppShell, AppShellHeader, AppShellMain, AppShellNavbar } from "@mantine/core";
import React, { useState } from "react";
import HeaderContent from "../main-menu/header-content";
import MobileNavbar from "../main-menu/navbar";

const MainAppShell = ({
    content,
    navbar,
    header,
    logo,
}: {
    header: React.ReactNode;
    navbar: React.ReactNode;
    content: React.ReactNode;
    logo: React.ReactNode;
}) => {
    const [opened, setOpened] = useState(false);

    const handleToggle = () => {
        setOpened(!opened);
    };

    const handleCloseNavbar = () => {
        setOpened(false);
    };

    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{
                width: 300,
                breakpoint: "lg",
                collapsed: { desktop: true, mobile: !opened },
            }}
            bg={"white"}
        >
            <AppShellHeader
                mt={0}
                // style={{ backgroundColor: "transparent" }}
                // withBorder={false}
            >
                <HeaderContent logo={logo} opened={opened} toggle={handleToggle}>
                    {header}
                </HeaderContent>
            </AppShellHeader>
            <AppShellNavbar>
                <MobileNavbar onClose={handleCloseNavbar}>{navbar}</MobileNavbar>
            </AppShellNavbar>
            <AppShellMain>{content}</AppShellMain>
        </AppShell>
    );
};

export default MainAppShell;
