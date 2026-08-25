import { createClient } from "@/prismicio";
import {
    Box,
    Button,
    Checkbox,
    Grid,
    Group,
    Image,
    Stack,
    TextInput,
    Text,
} from "@mantine/core";
import { PrismicRichText, SliceZone } from "@prismicio/react";
// import { CustomH4 } from "../custom-components/custom-heading";
// import { CustomText } from "../custom-components/custom-text";
// import { customBody1 } from "../custom-components/custom-text.css";
import { components } from "@/slices";
import { PrismicNextImage } from "@prismicio/next";

const Footer = async () => {
    const client = createClient();
    const footer = await client.getSingle("footer");

    return (
        <div style={{ marginTop: 376 }}>
            <Box
                bg={"#518581"}
                maw={{ lg: 1312, sm: 864, base: 468 }}
                miw={{ lg: 1072, sm: 608, base: 328 }}
                mx="auto"
                h={{ lg: 312, sm: 460, base: 545 }}
                mt={{ lg: -435, sm: -460, base: -568 }}
                pos={"relative"}
            >
                <Group
                    wrap="nowrap"
                    c={"#fff"}
                    maw={{ lg: 1183, sm: 800, base: 500 }}
                    mx="auto"
                >
                    <Stack gap={0} mt={{ base: 30, sm: 0, lg: 0 }}>
                        <PrismicRichText
                            field={footer.data.contacttitle}
                            components={{
                                heading4: ({ children }) => (
                                    <Text
                                        fz={{ lg: 26, sm: 20, base: 20 }}
                                        mt={{ lg: 30, sm: 30, base: 24 }}
                                        ml={{ sm: 40, base: 24 }}
                                        fw={600}
                                        c={"#fff"}
                                    >
                                        {children}
                                    </Text>
                                ),
                            }}
                        />
                        <PrismicRichText
                            field={footer.data.contactcontent}
                            components={{
                                paragraph: ({ children }) => (
                                    <Text
                                        fz={{ lg: 14, sm: 12, base: 12 }}
                                        mt={{ lg: 16, sm: 12, base: 12 }}
                                        mx={{ sm: 40, base: 24 }}
                                    >
                                        {children}
                                    </Text>
                                ),
                            }}
                        />

                        <Group mt={24}>
                            <TextInput
                                fz={{ lg: 14, sm: 12 }}
                                miw={{ lg: 140, sm: 720, base: 360 }}
                                fw={700}
                                ml={{ lg: 40, sm: 40, base: 24 }}
                                label="First name"
                                variant="unstyled"
                                style={{
                                    border: "none",
                                    borderBottom: "1px solid #FFF",
                                }}
                            />
                            <TextInput
                                fz={{ lg: 14, sm: 12 }}
                                w={{ lg: 140, sm: 720, base: 360 }}
                                fw={700}
                                ml={{ lg: 40, sm: 40, base: 24 }}
                                label="Last name"
                                variant="unstyled"
                                style={{
                                    border: "none",
                                    borderBottom: "1px solid #FFF",
                                }}
                            />
                            <TextInput
                                w={{ lg: 140, sm: 720, base: 360 }}
                                fz={{ lg: 14, sm: 12 }}
                                fw={700}
                                ml={{ lg: 40, sm: 40, base: 24 }}
                                label="Email"
                                variant="unstyled"
                                style={{
                                    border: "none",
                                    borderBottom: "1px solid #FFF",
                                }}
                            />

                            <Button
                                miw={{ lg: 138, sm: 138, base: 279 }}
                                mt={{ base: 32 }}
                                ml={{ lg: 40, sm: 32 }}
                                mx={{ base: "auto", lg: 0, sm: 0 }}
                                styles={{
                                    root: {
                                        backgroundColor: "#FFF",

                                        fontWeight: 600,
                                        fontSize: "15px",
                                        lineHeight: "22.4px",
                                        border: "1px solid",
                                    },
                                    label: {
                                        color: "#518581",
                                    },
                                }}
                            >
                                SEND
                            </Button>
                        </Group>
                    </Stack>
                    <Image
                        src={footer.data.contactimage.url}
                        alt=""
                        component={PrismicNextImage}
                        field={footer.data.contactimage}
                        height={390}
                        width={454}
                        visibleFrom="lg"
                        mt={-78}
                        pl={65}
                    />
                </Group>
            </Box>

            {/* </FooterLayout> */}
            <Box
                maw={{ base: 500, sm: 1024, lg: 1440 }}
                miw={{ base: 360, sm: 768, lg: 1200 }}
                m="auto"
                h={{ lg: 739, sm: 1200, base: 1028 }}
                bg={"white"}
            >
                <Grid
                    px={{ base: 24, sm: 144, lg: 114 }}
                    pt={{ lg: 254, sm: 382, base: 367 }}
                    mt={{ lg: -254, sm: -382, base: -367 }}
                    //   justify="center"
                >
                    <SliceZone
                        slices={footer.data.slices}
                        components={components}
                    ></SliceZone>
                </Grid>
            </Box>
        </div>
    );
};

export default Footer;
