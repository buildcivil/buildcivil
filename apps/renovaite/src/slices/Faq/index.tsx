/* eslint-disable react/no-unescaped-entities */

import {
    Accordion,
    AccordionControl,
    AccordionItem,
    AccordionPanel,
    Box,
    Stack,
    Text,
} from "@mantine/core";
import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";

/**
 * Props for `Faq`.
 */
export type FaqProps = SliceComponentProps<Content.FaqSlice>;

/**
 * Component for "Faq" Slices.
 */
const Faq = ({ slice }: FaqProps): JSX.Element => {
    return (
        <Box
            maw={{ base: 500, sm: 1024, lg: 1440 }}
            miw={{ base: 360, sm: 768, lg: 1200 }}
            m="auto"
            bg={"white"}
            pt={{ base: 50, lg: 100 }}
        >
            <Stack gap={30} px={{ base: 16, sm: 48, lg: 114 }}>
                <PrismicRichText
                    field={slice.primary.title}
                    components={{
                        heading2: ({ children }) => (
                            <Text
                                fz={{ base: 30, lg: 44 }}
                                fw={700}
                                ta={"center"}
                            >
                                {children}
                            </Text>
                        ),
                    }}
                />
                <Accordion variant="separated" defaultValue={"a"}>
                    <AccordionItem
                        value="a"
                        mt={{ base: 20, sm: 30, lg: 40 }}
                        styles={{
                            item: {
                                boxShadow: "var(--mantine-shadow-xs)",
                            },
                        }}
                    >
                        <AccordionControl fz={20} fw={700}>
                            How does RenovAIte work?
                        </AccordionControl>
                        <AccordionPanel>
                            RenovAIte is an AI-powered interior design software
                            that turns vacant or unfurnished areas into
                            exquisitely decorated rooms. Our AI examines the
                            area after a user uploads a snapshot and makes
                            recommendations for furniture, décor, and layouts
                            based on user preferences. An AI-based program for
                            virtual staging, emptying furnished areas,
                            gardening, redesigning furnished rooms, and
                            rendering exterior and interior structures will be
                            integrated into our website. <br />
                            <br />
                            Additionally, this software will operate on a
                            subscription basis. It will initially recommend
                            three to four themes and structures for free, but in
                            order to see all of the alternatives, you must buy a
                            membership.
                        </AccordionPanel>
                    </AccordionItem>
                    <AccordionItem
                        value="b"
                        mt={{ base: 20, sm: 30, lg: 40 }}
                        styles={{
                            item: {
                                boxShadow: "var(--mantine-shadow-xs)",
                            },
                        }}
                    >
                        <AccordionControl fz={20} fw={700}>
                            Who can use RenovAIte?
                        </AccordionControl>
                        <AccordionPanel>
                            Our app is easy to be used by anyone, regardless of
                            their knowledge or expertise in interiors, gardens
                            or architecture. It can be utilized by homeowners
                            seeking to remodel or build, architects in need of
                            fresh ideas or instant results, interior designers
                            looking for decorating suggestions and even
                            landscapers. Real estate agents and agencies also
                            use our software to enhace their listing, sell homes
                            easier and show quick AI interiors and exteriors
                            ideas. The tool's user-friendly interface and
                            advanced AI technology make it accessible to a broad
                            range of users
                        </AccordionPanel>
                    </AccordionItem>
                    <AccordionItem
                        value="c"
                        mt={{ base: 20, sm: 30, lg: 40 }}
                        styles={{
                            item: {
                                boxShadow: "var(--mantine-shadow-xs)",
                            },
                        }}
                    >
                        <AccordionControl fz={20} fw={700}>
                            Is it possible to save time and money with
                            RenovAIte?
                        </AccordionControl>
                        <AccordionPanel>
                            For both personal and business use, our app provides
                            an affordable option. Even upgrading to a premium
                            package for personal usage is still less expensive
                            than hiring experts. Without having to browse
                            through countless websites for ideas, you can use
                            our app to see how your house would appear with
                            various pieces of furniture, decorations, and garden
                            layouts.
                            <br />
                            Our AI algorithms make it simple to envision and
                            design beautiful houses by analyzing your
                            preferences and producing tailored recommendations.
                        </AccordionPanel>
                    </AccordionItem>
                    <AccordionItem
                        value="d"
                        mt={{ base: 20, sm: 30, lg: 40 }}
                        styles={{
                            item: {
                                boxShadow: "var(--mantine-shadow-xs)",
                            },
                        }}
                    >
                        <AccordionControl fz={20} fw={700}>
                            Does it function on any kind of device? (Apple, Mac,
                            iOS, Android, PC, laptop)
                        </AccordionControl>
                        <AccordionPanel>
                            Yes, this SaaS web application is compatible with
                            all devices. You can operate it from the most
                            popular browsers (Chrome, Firefox, and Safari)
                            without installing any desktop or mobile apps.
                        </AccordionPanel>
                    </AccordionItem>
                    <AccordionItem
                        value="e"
                        mt={{ base: 20, sm: 30, lg: 40 }}
                        styles={{
                            item: {
                                boxShadow: "var(--mantine-shadow-xs)",
                            },
                        }}
                    >
                        <AccordionControl fz={20} fw={700}>
                            How can RenovAIte enhance my home?
                        </AccordionControl>
                        <AccordionPanel>
                            There are many options for your interiors with
                            RenovAIte to create a unified and aesthetically
                            pleasing living area, you can experiment with
                            different furniture configurations, color palettes,
                            and décor alternatives. You'll have the resources to
                            realize your idea with AI-generated recommendations
                            and suggestions.
                        </AccordionPanel>
                    </AccordionItem>
                    <AccordionItem
                        value="f"
                        mt={{ base: 20, sm: 30, lg: 40 }}
                        styles={{
                            item: {
                                boxShadow: "var(--mantine-shadow-xs)",
                            },
                        }}
                    >
                        <AccordionControl fz={20} fw={700}>
                            Can landscaping tasks be handled using RenovAIte?
                        </AccordionControl>
                        <AccordionPanel>
                            You may design attractive outdoor environments with
                            our landscaping AI skills. Home Designs AI offers
                            AI-driven recommendations to assist you in making
                            well-informed decisions, whether you're designing a
                            stunning garden, a useful patio space, or a
                            welcoming backyard. You may design your ideal
                            outdoor retreat by experimenting with various plant
                            choices, hardscape components, and layout options
                            with landscaping AI.
                        </AccordionPanel>
                    </AccordionItem>
                    <AccordionItem
                        value="g"
                        mt={{ base: 20, sm: 30, lg: 40 }}
                        styles={{
                            item: {
                                boxShadow: "var(--mantine-shadow-xs)",
                            },
                        }}
                    >
                        <AccordionControl fz={20} fw={700}>
                            How can RenovAIte assist you with house staging and
                            virtual staging?
                        </AccordionControl>
                        <AccordionPanel>
                            Homeowners may efficiently stage their own homes
                            with HomeDesignsAI. Our software lets you experiment
                            with furniture placements, color schemes, and décor
                            selections to create the ideal home staging, whether
                            you're getting ready to sell your house or just want
                            to update your living areas. Before making any
                            actual modifications, you may observe the
                            transformation, which will assist you in making
                            well-informed choices regarding the interior design
                            of your house. We assist you in experimenting with
                            virtual staging by allowing you to submit a picture
                            of an existing location or an empty room. For both
                            homeowners and real estate agents, it's an extremely
                            useful tool.
                        </AccordionPanel>
                    </AccordionItem>
                    <AccordionItem
                        value="h"
                        mt={{ base: 20, sm: 30, lg: 40 }}
                        styles={{
                            item: {
                                boxShadow: "var(--mantine-shadow-xs)",
                            },
                        }}
                    >
                        <AccordionControl fz={20} fw={700}>
                            Does it function with sketches and architectural
                            plans?
                        </AccordionControl>
                        <AccordionPanel>
                            Of course! Architectural sketches can be used with
                            our software. You can quickly upload your digital
                            renderings or hand-drawn sketches to our platform.
                            By analyzing your sketches and producing realistic
                            visuals, HomeDesignsAI's AI-powered technology
                            enables you to consider many options and make
                            well-informed judgments. Make use of it to make your
                            architecture drawings come to life and become
                            reality.
                        </AccordionPanel>
                    </AccordionItem>
                    <AccordionItem
                        value="i"
                        mt={{ base: 20, sm: 30, lg: 40 }}
                        styles={{
                            item: {
                                boxShadow: "var(--mantine-shadow-xs)",
                            },
                        }}
                    >
                        <AccordionControl fz={20} fw={700}>
                            Is it possible for me to obtain ideas for homes,
                            houses, interiors, and exteriors at this time?
                        </AccordionControl>
                        <AccordionPanel>
                            Our software is being used extensively by our users
                            to come up with ideas for decorating their
                            under-construction homes and spaces (backyards,
                            residences, and rooms). This will allow you to plan
                            how you will construct and furnish your home before
                            the construction is complete.
                        </AccordionPanel>
                    </AccordionItem>
                    <AccordionItem
                        value="j"
                        mt={{ base: 20, sm: 30, lg: 40 }}
                        styles={{
                            item: {
                                boxShadow: "var(--mantine-shadow-xs)",
                            },
                        }}
                    >
                        <AccordionControl fz={20} fw={700}>
                            Can I get in touch with you or obtain help?
                        </AccordionControl>
                        <AccordionPanel>
                            Yes, our support link may be found in the page's
                            bottom.
                        </AccordionPanel>
                    </AccordionItem>
                </Accordion>
            </Stack>
        </Box>
    );
};

export default Faq;
