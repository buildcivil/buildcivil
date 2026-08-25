import {
    Box,
    Button,
    Divider,
    Grid,
    GridCol,
    Group,
    Input,
    Stack,
    Text,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconPhone, IconUser } from "@tabler/icons-react";
import React from "react";

const MobileNavbar = ({
    children,
    onClose,
}: {
    children: React.ReactNode;
    onClose: () => void;
}) => {
    return (
        <Stack onClick={onClose}>
            <Group justify="center" wrap="nowrap" gap={0.5}>
                <Button
                    variant="filled"
                    color="#292929"
                    fullWidth
                    h={46}
                    radius={0}
                    leftSection={<IconPhone color={"#FFF"} />}
                >
                    <Text c={"#FFF"} fz={14}>
                        Get in Touch
                    </Text>
                </Button>
                <Button
                    variant="filled"
                    color="#292929"
                    fullWidth
                    h={46}
                    radius={0}
                    leftSection={<IconUser color={"#FFF"} />}
                >
                    <Text c={"#FFF"} fz={14}>
                        My Account
                    </Text>
                </Button>
            </Group>
            {children}
            <Button
                variant="outline"
                radius={2}
                color="#555459"
                mt={{ base: 180 }}
                mx={16}
            >
                We’re Hiring!
            </Button>
        </Stack>
    );
};

export default MobileNavbar;
