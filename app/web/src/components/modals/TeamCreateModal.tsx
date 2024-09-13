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
} from "@mantine/core";
import MDIcon from "@/components/ui/MDIcon";
import { isEmail, useForm } from "@mantine/form";
import { useAuthStore } from "@/stores/auth";
import {
    showErrNotification,
    showSuccessNotification,
} from "@/utils/notification";
import { createTeam } from "@/api/team";

interface TeamCreateModalProps extends ModalProps {
    setRefresh: () => void;
}

export default function TeamCreateModal(props: TeamCreateModalProps) {
    const { setRefresh, ...modalProps } = props;
    const authStore = useAuthStore();

    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            name: "",
            description: "",
            email: "",
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
        },
    });

    function handleCreateTeam(
        name: string,
        description: string,
        email: string
    ) {
        createTeam({
            name: name,
            description: description,
            email: email,
            captain_id: Number(authStore.user?.id),
        })
            .then((_) => {
                showSuccessNotification({
                    message: `团队 ${form.values.name} Create Success`,
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
                            <Text fw={600}>Create团队</Text>
                        </Flex>
                        <Divider my={10} />
                        <Box p={10}>
                            <form
                                onSubmit={form.onSubmit((values) =>
                                    handleCreateTeam(
                                        values.name,
                                        values.description,
                                        values.email
                                    )
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
                                    <Textarea
                                        label="About the Team"
                                        size="md"
                                        key={form.key("description")}
                                        {...form.getInputProps("description")}
                                    />
                                    <TextInput
                                        label="Email"
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
        </>
    );
}
