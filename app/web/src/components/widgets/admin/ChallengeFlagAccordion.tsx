import MDIcon from "@/components/ui/MDIcon";
import { Flag, Type } from "@/types/flag";
import {
    Accordion,
    ActionIcon,
    Badge,
    Button,
    Center,
    Divider,
    Flex,
    Group,
    Select,
    SimpleGrid,
    Stack,
    Switch,
    Text,
    TextInput,
    Tooltip,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { randomId } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { useEffect } from "react";

interface ChallengeFlagAccordionProps {
    flag?: Flag;
    updateFlag: (flag: Flag) => void;
    deleteFlag: () => void;
}

export default function ChallengeFlagAccordion(
    props: ChallengeFlagAccordionProps
) {
    const { flag, updateFlag, deleteFlag } = props;

    const form = useForm({
        mode: "controlled",
        initialValues: {
            value: "",
            env: "",
            banned: false,
            type: Type.Pattern,
        },
    });

    const openDeleteFlagModal = () =>
        modals.openConfirmModal({
            centered: true,
            children: (
                <>
                    <Flex gap={10} align={"center"}>
                        <MDIcon>flag</MDIcon>
                        <Text fw={600}>删除 Flag</Text>
                    </Flex>
                    <Divider my={10} />
                    <Text>你Sure要删除 Flag {form.getValues().value} 吗？</Text>
                </>
            ),
            withCloseButton: false,
            labels: {
                confirm: "Sure",
                cancel: "Cancel",
            },
            confirmProps: {
                color: "red",
            },
            onConfirm: () => {
                deleteFlag();
            },
        });

    useEffect(() => {
        if (flag) {
            form.setValues({
                value: flag.value,
                env: flag.env,
                banned: flag.banned,
                type: flag.type,
            });
        }
    }, [flag]);

    return (
        <Accordion.Item value={randomId()}>
            <Center mr={20}>
                <Accordion.Control>
                    <Group>
                        <Badge color={flag?.banned ? "red" : "brand"}>
                            {flag?.type === Type.Pattern ? "正则" : "动态"}
                        </Badge>
                        <Text fw={600}>{flag?.value}</Text>
                        <Text fw={300}>{flag?.env}</Text>
                    </Group>
                </Accordion.Control>
                <Flex gap={10}>
                    <Tooltip label="删除 Flag" withArrow>
                        <ActionIcon onClick={() => openDeleteFlagModal()}>
                            <MDIcon color="red">delete</MDIcon>
                        </ActionIcon>
                    </Tooltip>
                </Flex>
            </Center>
            <Accordion.Panel>
                <form onSubmit={form.onSubmit((_) => updateFlag(form.values))}>
                    <Stack>
                        <SimpleGrid cols={3}>
                            <TextInput
                                label="Flag 值"
                                withAsterisk
                                description="使用正则时，请注意使用转义符"
                                key={form.key("value")}
                                {...form.getInputProps("value")}
                            />
                            <Select
                                label="Flag 类型"
                                description="不同的 Flag 类型，适用于不同的情境"
                                withAsterisk
                                data={[
                                    {
                                        label: "正则表达式",
                                        value: "pattern",
                                    },
                                    {
                                        label: "动态",
                                        value: "dynamic",
                                    },
                                ]}
                                key={form.key("type")}
                                {...form.getInputProps("type")}
                                allowDeselect={false}
                            />
                            <TextInput
                                label="环境变量"
                                description="当subject启用动态容器时，可设置将 Flag 以容器环境变量的形式注入容器"
                                key={form.key("env")}
                                {...form.getInputProps("env")}
                            />
                        </SimpleGrid>
                        <Flex gap={20} justify={"end"}>
                            <Switch
                                label="是否封禁此 Flag"
                                description="当用户提交此 Flag 时，直接判定为作弊"
                                checked={form.getValues().banned}
                                key={form.key("banned")}
                                {...form.getInputProps("banned")}
                            />
                        </Flex>
                        <Flex justify={"end"}>
                            <Button
                                type="submit"
                                leftSection={<MDIcon c={"white"}>check</MDIcon>}
                            >
                                save
                            </Button>
                        </Flex>
                    </Stack>
                </form>
            </Accordion.Panel>
        </Accordion.Item>
    );
}
