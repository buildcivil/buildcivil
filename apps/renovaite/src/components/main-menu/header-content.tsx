"use client";
import {
	ActionIcon,
	Autocomplete,
	Box,
	Burger,
	Button,
	Center,
	Container,
	Group,
	em,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconShoppingCart, IconUser } from "@tabler/icons-react";
import { PrismicNextLink } from "@prismicio/next";
import React from "react";

const HeaderContent = ({
	logo,
	children,
	opened,
	toggle,
}: {
	logo: React.ReactNode;
	children: React.ReactNode;
	opened: boolean;
	toggle: () => void;
}) => {
	const isLGScreen = useMediaQuery(`(min-width:${em(1200)})`);

	return (
		<Container
			maw={{ base: 500, sm: 1024, lg: 1440 }}
			miw={{ base: 360, sm: 768, lg: 1200 }}
			mt={17}
			// c={"white"}
		>
			<Group
				justify={isLGScreen ? "space-between" : "space-between"}
				px={{ base: 16, lg: 114 }}
				// mt={28}
				wrap="nowrap"
				align="flex-start"
			>
				{logo}
				<Burger
					opened={opened}
					onClick={() => toggle()}
					hiddenFrom="lg"
					size="md"
					color={"#209f9e"}
					// mr={{ sm: 64, base: 16, lg: 114 }}
				/>
				<Group visibleFrom="lg" wrap="nowrap" gap={80}>
					<Group gap={79} wrap="nowrap">
						{isLGScreen ? children : null}
					</Group>
					<ActionIcon variant="transparent">
						<IconUser color="#555459" width={30} height={30} />
					</ActionIcon>

					<ActionIcon variant="transparent">
						<IconShoppingCart color="#555459" width={30} height={30} />
					</ActionIcon>
				</Group>
			</Group>
		</Container>
	);
};

export default HeaderContent;
