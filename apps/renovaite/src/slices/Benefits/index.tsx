import { Box, Card, Grid, GridCol, Stack, Text } from "@mantine/core";
import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";

/**
 * Props for `Benefits`.
 */
export type BenefitsProps = SliceComponentProps<Content.BenefitsSlice>;

/**
 * Component for "Benefits" Slices.
 */
const Benefits = ({ slice }: BenefitsProps): JSX.Element => {
    return (
        <Box
            maw={{ base: 500, sm: 1024, lg: 1440 }}
            miw={{ base: 360, sm: 768, lg: 1200 }}
            m="auto"
            bg={"white"}
            pt={{ base: 100, lg: 180 }}
        >
            <Grid mx={{ base: 16, lg: 114 }}>
                <GridCol span={{ base: 12, lg: 6 }}>
                    <Stack gap={8}>
                        <PrismicRichText
                            field={slice.primary.title}
                            components={{
                                heading5: ({ children }) => (
                                    <Text
                                        c={"#FFB23F"}
                                        fz={{ base: 14, lg: 18 }}
                                        fw={700}
                                    >
                                        {children}
                                    </Text>
                                ),
                            }}
                        />
                        <PrismicRichText
                            field={slice.primary.subtitle}
                            components={{
                                heading2: ({ children }) => (
                                    <Text
                                        fz={{ base: 24, lg: 44 }}
                                        fw={700}
                                        w={{ base: 280, lg: 427 }}
                                    >
                                        {children}
                                    </Text>
                                ),
                            }}
                        />
                    </Stack>
                </GridCol>
                <GridCol span={{ base: 12, lg: 6 }}>
                    <PrismicRichText
                        field={slice.primary.para}
                        components={{
                            paragraph: ({ children }) => (
                                <Text mt={{ base: 0, lg: 53 }} c={"#AFADB5"}>
                                    {children}
                                </Text>
                            ),
                        }}
                    />
                </GridCol>
            </Grid>
            <Grid
                mx={{ base: 16, lg: 114 }}
                mt={{ base: 30, lg: 50 }}
                align="center"
                justify="center"
            >
                {slice.primary.card.map((item, index) => (
                    <GridCol span={{ base: 12, lg: 4 }} key={index}>
                        <Card
                            h={{ lg: 286 }}
                            shadow="lg"
                            bg={"#FFF"}
                            p={24}
                            style={{ border: "2px solid #f7f7f7" }}
                        >
                            <Stack gap={16} mt={12}>
                                <svg
                                    width="62"
                                    height="62"
                                    viewBox="0 0 62 62"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <circle
                                        cx="31"
                                        cy="31"
                                        r="31"
                                        fill="#F9F9F9"
                                    />
                                    <path
                                        d="M31 39.125V40.225C31 42.5625 30.0625 43.5 27.7125 43.5H21.775C19.9625 43.5 18.5 42.0375 18.5 40.225V34.2875C18.5 31.9375 19.4375 31 21.775 31H22.875V35.375C22.875 37.45 24.55 39.125 26.625 39.125H31Z"
                                        fill="url(#paint0_linear_0_1)"
                                    />
                                    <path
                                        d="M37.25 32.875V33.9625C37.25 35.775 35.775 37.25 33.9625 37.25H28.025C25.6875 37.25 24.75 36.3125 24.75 33.9625V28.025C24.75 26.2125 26.2125 24.75 28.025 24.75H29.125V29.125C29.125 31.2 30.8 32.875 32.875 32.875H37.25Z"
                                        fill="url(#paint1_linear_0_1)"
                                    />
                                    <path
                                        d="M43.5 21.775V27.7125C43.5 30.0625 42.5625 31 40.2125 31H34.275C31.9375 31 31 30.0625 31 27.7125V21.775C31 19.4375 31.9375 18.5 34.275 18.5H40.2125C42.5625 18.5 43.5 19.4375 43.5 21.775Z"
                                        fill="url(#paint2_linear_0_1)"
                                    />
                                    <defs>
                                        <linearGradient
                                            id="paint0_linear_0_1"
                                            x1="32.8977"
                                            y1="121.741"
                                            x2="0.781778"
                                            y2="119.196"
                                            gradientUnits="userSpaceOnUse"
                                        >
                                            <stop
                                                offset="0.25249"
                                                stopColor="#59A49E"
                                            />
                                            <stop
                                                offset="0.637527"
                                                stopColor="#A6D8D2"
                                            />
                                        </linearGradient>
                                        <linearGradient
                                            id="paint1_linear_0_1"
                                            x1="25"
                                            y1="37"
                                            x2="47.5"
                                            y2="16.5"
                                            gradientUnits="userSpaceOnUse"
                                        >
                                            <stop
                                                offset="0.138287"
                                                stopColor="#FFB23F"
                                            />
                                            <stop
                                                offset="0.467052"
                                                stopColor="#FAD8A5"
                                            />
                                        </linearGradient>
                                        <linearGradient
                                            id="paint2_linear_0_1"
                                            x1="45.3977"
                                            y1="109.241"
                                            x2="13.2818"
                                            y2="106.696"
                                            gradientUnits="userSpaceOnUse"
                                        >
                                            <stop
                                                offset="0.25249"
                                                stopColor="#59A49E"
                                            />
                                            <stop
                                                offset="0.637527"
                                                stopColor="#A6D8D2"
                                            />
                                        </linearGradient>
                                    </defs>
                                </svg>

                                <PrismicRichText field={item.cardtitle} />
                                <PrismicRichText field={item.cardpara} />
                            </Stack>
                        </Card>
                    </GridCol>
                ))}
            </Grid>
        </Box>
    );
};

export default Benefits;
