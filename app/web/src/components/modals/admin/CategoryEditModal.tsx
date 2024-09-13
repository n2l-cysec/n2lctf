import { getCategories, updateCategory } from "@/api/category";
import MDIcon from "@/components/ui/MDIcon";
import { Category } from "@/types/category";
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
import { useEffect, useState } from "react";
import { z } from "zod";

interface CategoryEditModalProps extends ModalProps {
    setRefresh: () => void;
    categoryID: number;
}

export default function CategoryEditModal(props: CategoryEditModalProps) {
    const { setRefresh, categoryID, ...modalProps } = props;

    const [category, setCategory] = useState<Category>();

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

    function handleGetCategory() {
        getCategories().then((res) => {
            const r = res.data;
            setCategory(r?.data?.find((c: Category) => c.id === categoryID));
        });
    }

    function handleUpdateCategory() {
        updateCategory({
            id: categoryID,
            name: form.getValues().name,
            icon: form.getValues().icon,
            color: form.getValues().color,
        }).then((_) => {
            showSuccessNotification({
                message: `Category ${form.getValues().name} Update Success`,
            });
            setRefresh();
            modalProps.onClose();
        });
    }

    useEffect(() => {
        form.reset();
        if (modalProps.opened) {
            handleGetCategory();
        }
    }, [modalProps.opened]);

    useEffect(() => {
        if (category) {
            form.setValues({
                name: category.name,
                color: category.color,
                icon: category.icon,
            });
        }
    }, [category]);

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
                            <Text fw={600}>Update Category</Text>
                        </Flex>
                        <Divider my={10} />
                        <Box p={10}>
                            <form
                                onSubmit={form.onSubmit((_) =>
                                    handleUpdateCategory()
                                )}
                            >
                                <Stack gap={10}>
                                    <TextInput
                                        label="Category Name"
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
                                        save
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
