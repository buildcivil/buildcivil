import {
    SliceSimulator,
    getSlices,
} from "@slicemachine/adapter-next/simulator";
import { SliceZone } from "@prismicio/react";
import { redirect } from "next/navigation";

import { components } from "@/slices";

type SimulatorSearchParams = {
    secret?: string;
    state?: string;
};

export default async function SliceSimulatorPage({
    searchParams,
}: {
    searchParams: Promise<SimulatorSearchParams> | SimulatorSearchParams;
}) {
    const params: SimulatorSearchParams = await searchParams;

    if (
        process.env.SLICE_SIMULATOR_SECRET &&
        params.secret !== process.env.SLICE_SIMULATOR_SECRET
    ) {
        redirect("/");
    }

    const slices = getSlices(params.state);

    return (
        <SliceSimulator>
            <SliceZone slices={slices} components={components} />
        </SliceSimulator>
    );
}
