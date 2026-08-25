import React from "react";
import MainAppShell from "./main-app-shell";
import { createClient } from "@/prismicio";
import { SliceZone } from "@prismicio/react";
import { components } from "@/slices";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";

const MainApp = async ({ children }: { children: React.ReactNode }) => {
    const client = createClient();
    const navigation = await client.getSingle("main_menu");
    const navbar = await client.getSingle("mobile_navbar");

    return (
        <MainAppShell
            content={children}
            header={<SliceZone slices={navigation.data.slices} components={components}></SliceZone>}
            navbar={<SliceZone slices={navbar.data.slices} components={components}></SliceZone>}
            logo={
                <PrismicNextLink href={"/"}>
                    <PrismicNextImage
                        field={navigation.data.logo}
                        height={250}
                        style={{ marginTop: -110 }}
                        alt=""
                    ></PrismicNextImage>
                </PrismicNextLink>
            }
        ></MainAppShell>
    );
};

export default MainApp;
