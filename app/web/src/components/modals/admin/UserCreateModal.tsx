import {
    Card,
    Flex,
    Modal,
    ModalProps,
    Text,
    Divider,
    TextInput,
    Stack,
    Button,
    Box,
    Select,
} from "@mantine/core";
import MDIcon from "@/components/ui/MDIcon";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { z } from "zod";
import {
    showErrNotification,
    showSuccessNotification,
} from "@/utils/notification";
import { useEffect } from "react";
import { createUser } from "@/api/user";
import { Group as UGroup } from "@/types/user";

interface UserCreateModalProps extends ModalProps {
    setRefresh: () => void;
}

export default function UserCreateModal(props: UserCreateModalProps) {
    const { setRefresh, ...modalProps } = props;

    const form = useForm({
        mode: "controlled",
        initialValues: {
            username: "",
            nickname: "",
            email: "",
            password: "",
            group: UGroup.User,
        },
        validate: zodResolver(
            z.object({
                username: z.string().regex(/^[a-z0-9_]{4,16}$/, {
                    message:
                        "Usernames can only contain lowercase letters, numbers, and underscores, and must be 4-16 characters long.",
                }),
                nickname: z.string().min(1, { message: "Nickname cannot be empty" }),
                email: z.string().email({ message: "The email format is incorrect" }),
                password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
            })
        ),
    });

    function handleCreateUser() {
        createUser({
            username: form.getValues().username,
            nickname: form.getValues().nickname,
            email: form.getValues().email,
            password: form.getValues().password,
            group: form.getValues().group,
        })
            .then((_) => {
                showSuccessNotification({
                    message: `用户 ${form.getValues().username} Create Success`,
                });
                setRefresh();
            })
            .catch((e) => {
                showErrNotification({
                    message: e.response.data.error || "Create user failed",
                });
            })
            .finally(() => {
                form.reset();
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
                            <MDIcon>person_add</MDIcon>
                            <Text fw={600}>Create User</Text>
                        </Flex>
                        <Divider my={10} />
                        <Box p={10}>
                            <form
                                onSubmit={form.onSubmit((_) =>
                                    handleCreateUser()
                                )}
                            >
                                <Stack gap={10}>
                                    <Flex gap={10} w={"100%"}>
                                        <TextInput
                                            label="username"
                                            size="md"
                                            w={"40%"}
                                            leftSection={
                                                <MDIcon>person</MDIcon>
                                            }
                                            key={form.key("username")}
                                            {...form.getInputProps("username")}
                                        />
                                        <TextInput
                                            label="Nick name"
                                            size="md"
                                            w={"60%"}
                                            key={form.key("nickname")}
                                            {...form.getInputProps("nickname")}
                                        />
                                    </Flex>
                                    <Select
                                        label="Permission Group"
                                        data={[
                                            {
                                                label: "administrator",
                                                value: UGroup.Admin.toString(),
                                            },
                                            {
                                                label: "Normal User",
                                                value: UGroup.User.toString(),
                                            },
                                        ]}
                                        allowDeselect={false}
                                        key={form.key("group")}
                                        value={form
                                            .getValues()
                                            .group.toString()}
                                        onChange={(value) => {
                                            form.setFieldValue(
                                                "group",
                                                Number(value)
                                            );
                                        }}
                                    />
                                    <TextInput
                                        label="Email"
                                        size="md"
                                        leftSection={<MDIcon>email</MDIcon>}
                                        key={form.key("email")}
                                        {...form.getInputProps("email")}
                                    />
                                    <TextInput
                                        label="password"
                                        size="md"
                                        leftSection={<MDIcon>lock</MDIcon>}
                                        key={form.key("password")}
                                        {...form.getInputProps("password")}
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
