import { createCategory } from "@/api/category";
import MDIcon from "@/components/ui/MDIcon";
import { showSuccessNotification } from "@/utils/notification";
import {
    Box,
    Button,
    Card,
    Divider,
    Flex,
    Modal,
    ModalProps,
    Stack,
    TextInput,
    Text,
    ColorInput,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useEffect } from "react";
import { z } from "zod";

interface CategoryCreateModalProps extends ModalProps {
    setRefresh: () => void;
}

export default function CategoryCreateModal(props: CategoryCreateModalProps) {
    const { setRefresh, ...modalProps } = props;

    const form = useForm({
        mode: "controlled",
        initialValues: {
            name: "",
            color: "",
            icon: "",
        },
        validate: zodResolver(
            z.object({
                name: z.string(),
            })
        ),
    });

    function handleCreateCategory() {
        createCategory({
            name: form.getValues().name,
            icon: form.getValues().icon,
            color: form.getValues().color,
        }).then((_) => {
            showSuccessNotification({
                message: `Classification ${form.getValues().name} Created successfully`,
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
                            <MDIcon>collections_bookmark</MDIcon>
                            <Text fw={600}>Create categories</Text>
                        </Flex>
                        <Divider my={10} />
                        <Box p={10}>
                            <form
                                onSubmit={form.onSubmit((_) =>
                                    handleCreateCategory()
                                )}
                            >
                                <Stack gap={10}>
                                    <TextInput
                                        label="Category name"
                                        withAsterisk
                                        key={form.key("name")}
                                        {...form.getInputProps("name")}
                                    />
                                    <ColorInput
                                        label="color"
                                        key={form.key("color")}
                                        {...form.getInputProps("color")}
                                    />
                                    <TextInput
                                        label="icon"
                                        withAsterisk
                                        leftSection={
                                            <MDIcon>
                                                {form.getValues().icon}
                                            </MDIcon>
                                        }
                                        key={form.key("icon")}
                                        {...form.getInputProps("icon")}
                                    />
                                </Stack>
                                <Flex mt={20} justify={"end"}>
                                    <Button
                                        type="submit"
                                        leftSection={
                                            <MDIcon c={"white"}>check</MDIcon>
                                        }
                                    >
                                        create
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
