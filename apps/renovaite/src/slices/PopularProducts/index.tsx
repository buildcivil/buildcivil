import { Carousel, CarouselSlide } from "@mantine/carousel";
import { Box, Stack, Text, Image } from "@mantine/core";
import { Content } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import "@mantine/carousel/styles.css";

/**
 * Props for `PopularProducts`.
 */
export type PopularProductsProps =
    SliceComponentProps<Content.PopularProductsSlice>;

/**
 * Component for "PopularProducts" Slices.
 */
const PopularProducts = ({ slice }: PopularProductsProps): JSX.Element => {
    return (
        <Box
            maw={{ base: 500, sm: 1024, lg: 1440 }}
            miw={{ base: 360, sm: 768, lg: 1200 }}
            m="auto"
            bg={"white"}
            pt={{ base: 100, lg: 180 }}
        >
            <PrismicRichText
                field={slice.primary.title}
                components={{
                    heading5: ({ children }) => (
                        <Text
                            c={"#FFB23F"}
                            fz={{ base: 14, lg: 18 }}
                            fw={700}
                            ta={"center"}
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
                        <Text fz={{ base: 24, lg: 44 }} fw={700} ta={"center"}>
                            {children}
                        </Text>
                    ),
                }}
            />
            <PrismicRichText
                field={slice.primary.para}
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
            <Carousel
                visibleFrom="sm"
                m={"auto"}
                // height={760}
                mt={50}
                slideSize="20%"
                slideGap={50}
                loop
                align="start"
                slidesToScroll={3}
                controlSize={52}
                styles={{
                    control: {
                        outline: "1px solid #fff",
                        color: "#fff",
                        backgroundColor: "#555459",
                        marginTop: "-350px",
                    },
                }}
                c={"#555459"}
            >
                {slice.primary.product.map((item, index) => (
                    <CarouselSlide key={index}>
                        <Stack gap={0}>
                            <PrismicNextImage field={item.image} alt="" />

                            <PrismicRichText
                                field={item.product_type}
                                components={{
                                    heading5: ({ children }) => (
                                        <Text
                                            ml={16}
                                            fz={18}
                                            mt={26}
                                            c={"#AFADB5"}
                                        >
                                            {children}
                                        </Text>
                                    ),
                                }}
                            />
                            <PrismicRichText
                                field={item.product_name}
                                components={{
                                    heading3: ({ children }) => (
                                        <Text ml={16} fz={26} mt={14} fw={700}>
                                            {children}
                                        </Text>
                                    ),
                                }}
                            />
                            <PrismicRichText
                                field={item.product_description}
                                components={{
                                    paragraph: ({ children }) => (
                                        <Text
                                            ml={16}
                                            fz={18}
                                            mt={6}
                                            c={"#AFADB5"}
                                        >
                                            {children}
                                        </Text>
                                    ),
                                }}
                            />
                            <PrismicRichText
                                field={item.price}
                                components={{
                                    heading3: ({ children }) => (
                                        <Text ml={16} fz={24} fw={700} mt={18}>
                                            {children}
                                        </Text>
                                    ),
                                }}
                            />
                        </Stack>
                    </CarouselSlide>
                ))}
            </Carousel>
            <Carousel
                hiddenFrom="sm"
                m={"auto"}
                // height={760}
                withControls={false}
                // w={1440}
                mt={30}
                slideSize="40%"
                slideGap={20}
                loop
                align="start"
                slidesToScroll={1}
                controlSize={30}
                c={"#555459"}
            >
                {slice.primary.product.map((item, index) => (
                    <CarouselSlide key={index}>
                        <Stack gap={0}>
                            <Image
                                component={PrismicNextImage}
                                field={item.image}
                                src={item.image.url}
                                h={194}
                                w={220}
                                alt=""
                            />

                            <PrismicRichText
                                field={item.product_type}
                                components={{
                                    heading5: ({ children }) => (
                                        <Text
                                            ml={16}
                                            fz={14}
                                            mt={14}
                                            c={"#AFADB5"}
                                        >
                                            {children}
                                        </Text>
                                    ),
                                }}
                            />
                            <PrismicRichText
                                field={item.product_name}
                                components={{
                                    heading3: ({ children }) => (
                                        <Text ml={16} fz={16} mt={6} fw={700}>
                                            {children}
                                        </Text>
                                    ),
                                }}
                            />
                            <PrismicRichText
                                field={item.product_description}
                                components={{
                                    paragraph: ({ children }) => (
                                        <Text
                                            ml={16}
                                            fz={18}
                                            mt={6}
                                            c={"#AFADB5"}
                                        >
                                            {children}
                                        </Text>
                                    ),
                                }}
                            />
                            <PrismicRichText
                                field={item.price}
                                components={{
                                    heading3: ({ children }) => (
                                        <Text ml={16} fz={14} fw={700} mt={4}>
                                            {children}
                                        </Text>
                                    ),
                                }}
                            />
                        </Stack>
                    </CarouselSlide>
                ))}
            </Carousel>
        </Box>
    );
};

export default PopularProducts;
