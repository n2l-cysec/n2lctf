import { getChallenges, updateChallenge } from "@/api/challenge";
import withChallengeEdit from "@/components/layouts/admin/withChallengeEdit";
import MDIcon from "@/components/ui/MDIcon";
import { Challenge } from "@/types/challenge";
import { Flag, Type } from "@/types/flag";
import { showSuccessNotification } from "@/utils/notification";
import {
    Flex,
    Group,
    Stack,
    Text,
    Divider,
    ActionIcon,
    Tooltip,
    Button,
    Select,
    TextInput,
    Badge,
    Center,
    Checkbox,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Page() {
    const { id } = useParams<{ id: string }>();

    const [challenge, setChallenge] = useState<Challenge>();
    const [flags, setFlags] = useState<Array<Flag>>([]);

    function handleGetChallenge() {
        getChallenges({
            id: Number(id),
            is_detailed: true,
        }).then((res) => {
            const r = res.data;
            setChallenge(r.data[0]);
        });
    }

    function handleUpdateChallengeFlag() {
        updateChallenge({
            id: Number(id),
            flags: flags,
        }).then((_) => {
            showSuccessNotification({
                message: "Flag Update Success",
            });
        });
    }

    useEffect(() => {
        handleGetChallenge();
    }, []);

    useEffect(() => {
        setFlags(challenge?.flags || []);
    }, [challenge]);

    useEffect(() => {
        document.title = `Flags - ${challenge?.title}`;
    }, [challenge]);

    return (
        <>
            <Stack m={36}>
                <Stack gap={10}>
                    <Flex justify={"space-between"} align={"center"}>
                        <Group>
                            <MDIcon>flag</MDIcon>
                            <Text fw={700} size="xl">
                                Flags
                            </Text>
                        </Group>
                        <Tooltip label="Create Flag" withArrow>
                            <ActionIcon
                                onClick={() => {
                                    setFlags([
                                        ...flags,
                                        {
                                            value: "",
                                            type: Type.Static,
                                            banned: false,
                                            env: "",
                                        },
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
                    {flags?.map((flag, index) => (
                        <Flex gap={15} key={index} align={"center"}>
                            <Center>
                                <Badge color={flag?.banned ? "red" : "brand"}>
                                    {index + 1}
                                </Badge>
                            </Center>
                            <TextInput
                                label="Flag Value"
                                value={flag.value}
                                flex={1}
                                onChange={(e) => {
                                    setFlags(
                                        flags.map((f, i) =>
                                            i === index
                                                ? {
                                                      ...f,
                                                      value: e.target.value,
                                                  }
                                                : f
                                        )
                                    );
                                }}
                            />
                            <Select
                                w={"15%"}
                                label="Flag Type"
                                data={[
                                    {
                                        label: "Static",
                                        value: Type.Static.toString(),
                                    },
                                    {
                                        label: "Pattern",
                                        value: Type.Pattern.toString(),
                                    },
                                    {
                                        label: "Dynamic",
                                        value: Type.Dynamic.toString(),
                                    },
                                ]}
                                allowDeselect={false}
                                value={flag.type.toString()}
                                onChange={(value) => {
                                    setFlags(
                                        flags.map((f, i) =>
                                            i === index
                                                ? {
                                                      ...f,
                                                      type: Number(value),
                                                  }
                                                : f
                                        )
                                    );
                                }}
                            />
                            <TextInput
                                w={"15%"}
                                label="Environment Variable"
                                value={flag.env}
                                onChange={(e) => {
                                    setFlags(
                                        flags.map((f, i) =>
                                            i === index
                                                ? {
                                                      ...f,
                                                      env: e.target.value,
                                                  }
                                                : f
                                        )
                                    );
                                }}
                            />
                            <Checkbox
                                label="Ban This Flag"
                                description="Users submitting this Flag will be considered cheating"
                                checked={flag.banned}
                                onChange={(e) => {
                                    setFlags(
                                        flags.map((f, i) =>
                                            i === index
                                                ? {
                                                      ...f,
                                                      banned: e.target.checked,
                                                  }
                                                : f
                                        )
                                    );
                                }}
                            />
                            <Flex justify={"end"} align={"center"}>
                                <ActionIcon
                                    onClick={() => {
                                        setFlags(
                                            flags.filter((_, i) => i !== index)
                                        );
                                    }}
                                >
                                    <MDIcon c={"red"}>delete</MDIcon>
                                </ActionIcon>
                            </Flex>
                        </Flex>
                    ))}
                </Stack>
                <Flex justify="end">
                    <Button
                        leftSection={<MDIcon c={"white"}>check</MDIcon>}
                        onClick={() => handleUpdateChallengeFlag()}
                    >
                        Save
                    </Button>
                </Flex>
            </Stack>
        </>
    );
}

export default withChallengeEdit(Page);
