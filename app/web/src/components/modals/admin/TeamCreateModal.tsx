import {
    Card,
    Flex,
    Modal,
    ModalProps,
    Text,
    Divider,
    TextInput,
    Stack,
    Textarea,
    Button,
    Box,
    Input,
    Group,
} from "@mantine/core";
import MDIcon from "@/components/ui/MDIcon";
import { isEmail, useForm } from "@mantine/form";
import {
    showErrNotification,
    showSuccessNotification,
} from "@/utils/notification";
import { useEffect, useState } from "react";
import { User } from "@/types/user";
import UserSelectModal from "./UserSelectModal";
import { useDisclosure } from "@mantine/hooks";
import { createTeam } from "@/api/team";

interface TeamCreateModalProps extends ModalProps {
    setRefresh: () => void;
}

export default function TeamCreateModal(props: TeamCreateModalProps) {
    const { setRefresh, ...modalProps } = props;

    const [captain, setCaptain] = useState<User>();

    const [userSelectOpened, { open: userSelectOpen, close: userSelectClose }] =
        useDisclosure(false);

    const form = useForm({
        mode: "controlled",
        initialValues: {
            name: "",
            description: "",
            email: "",
            captain_id: 0,
        },
        validate: {
            name: (value) => {
                if (value === "") {
                    return "Team name cannot be empty";
                }
                return null;
            },
            description: (value) => {
                if (value === "") {
                    return "Team profile cannot be empty";
                }
                return null;
            },
            email: isEmail("The email format is incorrect"),
            captain_id: (value) => {
                if (value === 0) {
                    return "Captain cannot be empty";
                }
                return null;
            },
        },
    });

    useEffect(() => {
        if (captain) {
            form.setFieldValue("captain_id", Number(captain?.id));
        }
    }, [captain]);

    function handleCreateTeam() {
        createTeam({
            name: form.getValues().name,
            description: form.getValues().description,
            email: form.getValues().email,
            captain_id: form.getValues().captain_id,
        })
            .then((_) => {
                showSuccessNotification({
                    message: `team ${form.values.name} Create Success`,
                });
                setRefresh();
            })
            .catch((e) => {
                showErrNotification({
                    message: e.response.data.error || "Create team failed",
                });
            })
            .finally(() => {
                form.reset();
                modalProps.onClose();
            });
    }

    useEffect(() => {
        form.reset();
        setCaptain(undefined);
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
                            <MDIcon>group_add</MDIcon>
                            <Text fw={600}>Create Team</Text>
                        </Flex>
                        <Divider my={10} />
                        <Box p={10}>
                            <form
                                onSubmit={form.onSubmit((_) =>
                                    handleCreateTeam()
                                )}
                            >
                                <Stack gap={10}>
                                    <TextInput
                                        label="Team Name"
                                        size="md"
                                        leftSection={<MDIcon>people</MDIcon>}
                                        key={form.key("name")}
                                        {...form.getInputProps("name")}
                                    />
                                    <Input.Wrapper
                                        label="team leader"
                                        size="md"
                                        key={form.key("captain_id")}
                                        {...form.getInputProps("captain_id")}
                                    >
                                        <Button
                                            size="lg"
                                            onClick={userSelectOpen}
                                            justify="start"
                                            fullWidth
                                            variant="light"
                                        >
                                            {captain && (
                                                <>
                                                    <Group gap={15}>
                                                        <Text
                                                            fw={700}
                                                            size="1rem"
                                                        >
                                                            {captain?.username}
                                                        </Text>
                                                        <Text
                                                            fw={500}
                                                            size="1rem"
                                                        >
                                                            {captain?.nickname}
                                                        </Text>
                                                    </Group>
                                                </>
                                            )}
                                            {!captain && "Choose a Captain"}
                                        </Button>
                                    </Input.Wrapper>
                                    <Textarea
                                        label="About the Team"
                                        size="md"
                                        key={form.key("description")}
                                        {...form.getInputProps("description")}
                                    />
                                    <TextInput
                                        label="email"
                                        size="md"
                                        leftSection={<MDIcon>email</MDIcon>}
                                        key={form.key("email")}
                                        {...form.getInputProps("email")}
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
            <UserSelectModal
                setUser={(user) => setCaptain(user)}
                opened={userSelectOpened}
                onClose={userSelectClose}
                centered
            />
        </>
    );
}
