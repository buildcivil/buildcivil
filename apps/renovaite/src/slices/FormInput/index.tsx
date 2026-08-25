"use client";
import {
    Box,
    FileInput,
    Grid,
    GridCol,
    Group,
    Image,
    Stack,
    Select,
    Button,
    Paper,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { Content } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import { SliceComponentProps } from "@prismicio/react";
import { useEffect, useState } from "react";

/**
 * Props for `FormInput`.
 */
export type FormInputProps = SliceComponentProps<Content.FormInputSlice>;

interface FormValues {
    roomImage: File | null;
    roomType: string;
    designStyle: string;
    numDesigns: number;
}
/**
 * Component for "FormInput" Slices.
 */
const FormInput = ({ slice }: FormInputProps): JSX.Element => {
    // const [roomType, setRoomType] = useState('');
    // const [designStyle, setDesignStyle] = useState('');
    // const [numDesigns, setNumDesigns] = useState(1);
    // const [image, setImage] = useState(null);

    const form = useForm<FormValues>({
        initialValues: {
            roomImage: null,
            roomType: "",
            designStyle: "",
            numDesigns: 1,
        },
    });

    useEffect(() => {}, []);

    const handleSubmit = (values: FormValues) => {
        console.log(values);
    };

    // const [roomType, setRoomType] = useState('');
    // const [designStyle, setDesignStyle] = useState('');
    // const [numDesigns, setNumDesigns] = useState(1);
    // const [image, setImage] = useState(null);

    // const handleImageChange = (event: any) => {
    //   setImage(event.target.files[0]);
    // };

    // const handleRoomTypeChange = (event: any) => {
    //   setRoomType(event.target.value);
    // };

    // const handleDesignStyleChange = (event: any) => {
    //   setDesignStyle(event.target.value);
    // };

    // const handleNumDesignsChange = (event: any) => {
    //   setNumDesigns(event.target.value);
    // };

    // const handleSubmit = (event: any) => {
    //   event.preventDefault();
    // };

    return (
        <Box
            maw={{ base: 500, sm: 1024, lg: 1440 }}
            miw={{ base: 360, sm: 768, lg: 1200 }}
            m="auto"
            bg={"white"}
            pb={200}
        >
            <Paper p="xl" mb="md">
                <Grid
                    justify="center"
                    mx={{ base: 16, lg: 144 }}
                    gutter={{ base: 10, lg: 50 }}
                >
                    <GridCol span={6}>
                        <Stack>
                            <Group wrap="nowrap">
                                {slice.primary.items.map((item, index) => (
                                    <Image
                                        component={PrismicNextImage}
                                        field={item.image}
                                        src={item.image.url}
                                        key={index}
                                        w={250}
                                        h={250}
                                    />
                                ))}
                            </Group>
                        </Stack>
                    </GridCol>
                    <GridCol span={6}>
                        <form>
                            <Stack gap={15}>
                                <FileInput
                                    variant="filled"
                                    label="Upload Room Image:"
                                    withAsterisk
                                    // onChange={handleImageChange}
                                    {...form.getInputProps("roomImage")}
                                />
                                <Select
                                    // value={roomType}
                                    // onChange={handleRoomTypeChange}
                                    {...form.getInputProps("roomType")}
                                    label="Select Room type:"
                                    data={[
                                        { value: "bedroom", label: "Bedroom" },
                                        { value: "balcony", label: "Balcony" },
                                        {
                                            value: "bathroom",
                                            label: "Bathroom",
                                        },
                                    ]}
                                />
                                <Select
                                    // value={designStyle}
                                    // onChange={handleDesignStyleChange}
                                    {...form.getInputProps("designStyle")}
                                    label="Select Design type:"
                                    data={[
                                        {
                                            value: "eclectic",
                                            label: "Eclectic",
                                        },
                                        { value: "modern", label: "Modern" },
                                        {
                                            value: "scandinavian",
                                            label: "Scandinavian",
                                        },
                                    ]}
                                />
                                <Select
                                    // value={numDesigns}
                                    // onChange={handleNumDesignsChange}
                                    {...form.getInputProps("numDesigns")}
                                    label="Select No of designs:"
                                    data={[
                                        { value: "1", label: "1" },
                                        { value: "2", label: "2" },
                                        { value: "3", label: "3" },
                                    ]}
                                />
                                <Button
                                    bg={"#518581"}
                                    onClick={() => form.onSubmit(handleSubmit)}
                                >
                                    Generate Designs
                                </Button>
                            </Stack>
                        </form>
                    </GridCol>
                </Grid>
            </Paper>
        </Box>
    );
};

export default FormInput;
