import { getChallenges, updateChallenge } from "@/api/challenge";
import withChallengeEdit from "@/components/layouts/admin/withChallengeEdit";
import MDIcon from "@/components/ui/MDIcon";
import { Challenge } from "@/types/challenge";
import { Env } from "@/types/env";
import { showSuccessNotification } from "@/utils/notification";
import {
    ActionIcon,
    Button,
    Checkbox,
    Divider,
    Flex,
    Group,
    NumberInput,
    SimpleGrid,
    Stack,
    Text,
    TextInput,
    Tooltip,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function Page() {
    const { id } = useParams<{ id: string }>();

    const [refresh, setRefresh] = useState<number>(0);
    const [challenge, setChallenge] = useState<Challenge>();

    const [envs, setEnvs] = useState<Array<Env>>([]);
    const [ports, setPorts] = useState<Array<number>>([]);

    const form = useForm({
        initialValues: {
            image_name: "",
            cpu_limit: 1,
            memory_limit: 256,
            is_dynamic: false,
            duration: 1800,
        },
    });

    function handleGetChallenge() {
        getChallenges({
            id: Number(id),
            is_detailed: true,
        }).then((res) => {
            const r = res.data;
            setChallenge(r.data?.[0]);
            setEnvs(r.data?.[0]?.envs || []);
            setPorts(r.data?.[0]?.ports || []);
        });
    }

    function handleUpdateChallengeImage() {
        updateChallenge({
            id: Number(id),
            image_name: form.getValues().image_name,
            cpu_limit: form.getValues().cpu_limit,
            memory_limit: form.getValues().memory_limit,
            envs: envs,
            ports: ports,
            is_dynamic: form.getValues().is_dynamic,
            duration: form.getValues().duration,
        }).then((_) => {
            showSuccessNotification({
                message: "Image Update Success",
            });
            setRefresh((prev) => prev + 1);
        });
    }

    useEffect(() => {
        form.setValues({
            image_name: challenge?.image_name || "",
            cpu_limit: challenge?.cpu_limit || 1,
            memory_limit: challenge?.memory_limit || 256,
            is_dynamic: challenge?.is_dynamic || false,
            duration: challenge?.duration || 1800,
        });
    }, [challenge]);

    useEffect(() => {
        handleGetChallenge();
    }, [refresh]);

    useEffect(() => {
        document.title = `Container - ${challenge?.title}`;
    }, [challenge]);

    return (
        <Stack m={36}>
            <form onSubmit={form.onSubmit((_) => handleUpdateChallengeImage())}>
                <Stack>
                    <Stack gap={10}>
                        <Group>
                            <MDIcon>deployed_code_update</MDIcon>
                            <Text fw={700} size="xl">
                                Container Parameters
                            </Text>
                        </Group>
                        <Divider />
                    </Stack>
                    <Stack mx={20}>
                        <SimpleGrid cols={2}>
                            <Checkbox
                                my={"auto"}
                                label="Enable Container"
                                description={
                                    "Whether the container environment needs to be enabled for subject distribution"
                                }
                                checked={form.getValues().is_dynamic}
                                onChange={(e) =>
                                    form.setFieldValue(
                                        "is_dynamic",
                                        e.currentTarget.checked
                                    )
                                }
                            />
                            <TextInput
                                label="Image Name"
                                description="e.g., nginx:latest"
                                key={form.key("image_name")}
                                {...form.getInputProps("image_name")}
                            />
                        </SimpleGrid>
                        <SimpleGrid cols={3}>
                            <NumberInput
                                label="CPU Limit"
                                description="CPU core limit (cores)"
                                key={form.key("cpu_limit")}
                                {...form.getInputProps("cpu_limit")}
                            />
                            <NumberInput
                                label="Memory Limit"
                                description="Memory size limit (MB)"
                                key={form.key("memory_limit")}
                                {...form.getInputProps("memory_limit")}
                            />
                            <NumberInput
                                label="Duration"
                                description="Dynamic container duration (seconds)"
                                key={form.key("duration")}
                                {...form.getInputProps("duration")}
                            />
                        </SimpleGrid>
                    </Stack>
                    <Stack gap={10}>
                        <Flex justify={"space-between"} align="center">
                            <Group>
                                <MDIcon>upgrade</MDIcon>
                                <Text fw={700} size="xl">
                                    Port Mapping
                                </Text>
                            </Group>
                            <Tooltip label="Add Port Mapping" withArrow>
                                <ActionIcon
                                    onClick={() => setPorts([...ports, 0])}
                                >
                                    <MDIcon>add</MDIcon>
                                </ActionIcon>
                            </Tooltip>
                        </Flex>
                        <Divider />
                    </Stack>
                    <SimpleGrid mx={20} cols={4}>
                        {ports?.map((port, index) => (
                            <Flex gap={10} key={index} align={"center"}>
                                <NumberInput
                                    value={port}
                                    onChange={(e) =>
                                        setPorts(
                                            ports.map((p, i) =>
                                                i === index ? Number(e) : p
                                            )
                                        )
                                    }
                                />
                                <Tooltip
                                    label="Delete Port Mapping"
                                    withArrow
                                    onClick={() => {
                                        const newPorts = [...ports];
                                        newPorts.splice(index, 1);
                                        setPorts(newPorts);
                                    }}
                                >
                                    <ActionIcon>
                                        <MDIcon color={"red"}>delete</MDIcon>
                                    </ActionIcon>
                                </Tooltip>
                            </Flex>
                        ))}
                    </SimpleGrid>
                    <Stack gap={10}>
                        <Flex justify={"space-between"} align="center">
                            <Group>
                                <MDIcon>language</MDIcon>
                                <Text fw={700} size="xl">
                                    Environment Variables
                                </Text>
                            </Group>
                            <Tooltip label="Add Environment Variable" withArrow>
                                <ActionIcon
                                    onClick={() => {
                                        setEnvs([
                                            ...envs,
                                            { key: "", value: "" },
                                        ]);
                                    }}
                                >
                                    <MDIcon>add</MDIcon>
                                </ActionIcon>
                            </Tooltip>
                        </Flex>
                        <Divider />
                    </Stack>
                    <Stack mx={20}>
                        {envs?.map((env, index) => (
                            <Flex
                                key={index}
                                align={"center"}
                                justify={"space-between"}
                            >
                                <Group gap={10}>
                                    <TextInput
                                        label="Key"
                                        value={env?.key}
                                        onChange={(e) =>
                                            setEnvs(
                                                envs.map((p, i) =>
                                                    i === index
                                                        ? {
                                                              ...p,
                                                              key: e.target
                                                                  .value,
                                                          }
                                                        : p
                                                )
                                            )
                                        }
                                    />
                                    <TextInput
                                        label="Value"
                                        value={env?.value}
                                        onChange={(e) =>
                                            setEnvs(
                                                envs.map((p, i) =>
                                                    i === index
                                                        ? {
                                                              ...p,
                                                              value: e.target
                                                                  .value,
                                                          }
                                                        : p
                                                )
                                            )
                                        }
                                    />
                                </Group>
                                <Tooltip
                                    label="Delete Environment Variable"
                                    withArrow
                                    onClick={() => {
                                        const newEnvs = [...envs];
                                        newEnvs.splice(index, 1);
                                        setEnvs(newEnvs);
                                    }}
                                >
                                    <ActionIcon>
                                        <MDIcon color={"red"}>delete</MDIcon>
                                    </ActionIcon>
                                </Tooltip>
                            </Flex>
                        ))}
                    </Stack>
                    <Flex justify="end">
                        <Button
                            type="submit"
                            leftSection={<MDIcon c={"white"}>check</MDIcon>}
                        >
                            Save
                        </Button>
                    </Flex>
                </Stack>
            </form>
        </Stack>
    );
}

export default withChallengeEdit(Page);
