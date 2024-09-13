import MDIcon from "@/components/ui/MDIcon";
import { showSuccessNotification } from "@/utils/notification";
import {
    Box,
    Button,
    Divider,
    Flex,
    Modal,
    ModalProps,
    Stack,
    TextInput,
    Text,
    Card,
    Textarea,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { DateTimePicker } from "@mantine/dates";
import { useEffect } from "react";
import { z } from "zod";
import { createGame } from "@/api/game";

interface GameCreateModalProps extends ModalProps {
    setRefresh: () => void;
}

export default function GameCreateModal(props: GameCreateModalProps) {
    const { setRefresh, ...modalProps } = props;

    const form = useForm({
        mode: "controlled",
        initialValues: {
            title: "",
            bio: "",
            started_at: new Date().getTime() / 1000,
            ended_at: new Date().getTime() / 1000,
        },
        validate: zodResolver(
            z.object({
                title: z.string(),
                bio: z.string().optional(),
                started_at: z.number(),
                ended_at: z.number(),
            })
        ),
    });

    function handleCreateGame() {
        createGame({
            title: form.getValues().title,
            bio: form.getValues().bio,
            started_at: Math.ceil(form.getValues().started_at),
            ended_at: Math.ceil(form.getValues().ended_at),
            is_enabled: false,
        }).then((_) => {
            showSuccessNotification({
                message: `比赛 ${form.getValues().title} Create Success`,
            });
            setRefresh();
            modalProps.onClose();
        });
    }

    useEffect(() => {
        form.reset();
    }, [modalProps.opened]);

    return (
        <>
            <Modal.Root {...modalProps}>
                <Modal.Overlay />
                <Modal.Content
                    sx={{
                        flex: "none",
                        backgroundColor: "transparent",
                    }}
                >
                    <Card
                        shadow="md"
                        padding={"lg"}
                        radius={"md"}
                        withBorder
                        w={"40rem"}
                    >
                        <Flex gap={10} align={"center"}>
                            <MDIcon>flag</MDIcon>
                            <Text fw={600}>Create Competition</Text>
                        </Flex>
                        <Divider my={10} />
                        <Box p={10}>
                            <form
                                onSubmit={form.onSubmit((_) =>
                                    handleCreateGame()
                                )}
                            >
                                <Stack gap={10}>
                                    <TextInput
                                        label="Competition Name"
                                        size="md"
                                        withAsterisk
                                        key={form.key("title")}
                                        {...form.getInputProps("title")}
                                    />
                                    <Textarea
                                        label="Competition Introduction"
                                        size="md"
                                        key={form.key("bio")}
                                        {...form.getInputProps("bio")}
                                    />
                                    <DateTimePicker
                                        withSeconds
                                        withAsterisk
                                        label="Start time"
                                        placeholder="Please select the time the game starts"
                                        valueFormat="YYYY/MM/DD HH:mm:ss"
                                        value={
                                            new Date(
                                                form.getValues().started_at *
                                                    1000
                                            )
                                        }
                                        onChange={(value) => {
                                            form.setFieldValue(
                                                "started_at",
                                                Number(value?.getTime()) / 1000
                                            );
                                        }}
                                    />
                                    <DateTimePicker
                                        withSeconds
                                        withAsterisk
                                        label="End time"
                                        placeholder="Please select the time when the game ends"
                                        valueFormat="YYYY/MM/DD HH:mm:ss"
                                        value={
                                            new Date(
                                                form.getValues().ended_at * 1000
                                            )
                                        }
                                        onChange={(value) => {
                                            form.setFieldValue(
                                                "ended_at",
                                                Number(value?.getTime()) / 1000
                                            );
                                        }}
                                    />
                                </Stack>
                                <Flex mt={20} justify={"end"}>
                                    <Button
                                        type="submit"
                                        leftSection={
                                            <MDIcon c={"white"}>check</MDIcon>
                                        }
                                    >
                                        Create
                                    </Button>
                                </Flex>
                            </form>
                        </Box>
                    </Card>
                </Modal.Content>
            </Modal.Root>
        </>
    );
}
