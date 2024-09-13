import MDIcon from "@/components/ui/MDIcon";
import {
    Flex,
    Stack,
    ActionIcon,
    Paper,
    Table,
    Badge,
    Group,
    Text,
    ColorSwatch,
    Divider,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { Category } from "@/types/category";
import { modals } from "@mantine/modals";
import { showSuccessNotification } from "@/utils/notification";
import CategoryCreateModal from "@/components/modals/admin/CategoryCreateModal";
import CategoryEditModal from "@/components/modals/admin/CategoryEditModal";
import { useDisclosure } from "@mantine/hooks";
import { deleteCategory, getCategories } from "@/api/category";

export default function Page() {
    const [refresh, setRefresh] = useState<number>(0);
    const [categories, setCategories] = useState<Array<Category>>([]);

    const [createOpened, { open: createOpen, close: createClose }] =
        useDisclosure(false);
    const [editOpened, { open: editOpen, close: editClose }] =
        useDisclosure(false);
    const [selectedCategory, setSelectedCategory] = useState<Category>();

    function handleGetCategories() {
        getCategories().then((res) => {
            const r = res.data;
            setCategories(r?.data);
        });
    }

    function handleDeleteCategory(category?: Category) {
        deleteCategory({
            id: category?.id,
        }).then((_) => {
            showSuccessNotification({
                message: "Category deleted successfully",
            });
            setRefresh((prev) => prev + 1);
        });
    }

    const openDeleteCategoryModal = (category?: Category) =>
        modals.openConfirmModal({
            centered: true,
            children: (
                <>
                    <Flex gap={10} align={"center"}>
                        <MDIcon>bookmark_remove</MDIcon>
                        <Text fw={600}>Delete Category</Text>
                    </Flex>
                    <Divider my={10} />
                    <Text>
                        Are you sure you want to delete the category {category?.name}?
                        (All subjects under this category will also be deleted)
                    </Text>
                </>
            ),
            withCloseButton: false,
            labels: {
                confirm: "Confirm",
                cancel: "Cancel",
            },
            confirmProps: {
                color: "red",
            },
            onConfirm: () => {
                handleDeleteCategory(category);
            },
        });

    useEffect(() => {
        handleGetCategories();
    }, [refresh]);

    return (
        <>
            <Flex my={36} mx={"10%"} justify={"center"}>
                <Paper shadow={"md"} mih={"calc(100vh - 10rem)"} flex={1}>
                    <Table stickyHeader horizontalSpacing={"md"} striped>
                        <Table.Thead>
                            <Table.Tr
                                sx={{
                                    lineHeight: 3,
                                }}
                            >
                                <Table.Th>#</Table.Th>
                                <Table.Th>Category Name</Table.Th>
                                <Table.Th>Color (Hex)</Table.Th>
                                <Table.Th>Icon</Table.Th>
                                <Table.Th>
                                    <Flex justify={"center"}>
                                        <ActionIcon
                                            variant="transparent"
                                            onClick={createOpen}
                                        >
                                            <MDIcon>add</MDIcon>
                                        </ActionIcon>
                                    </Flex>
                                </Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {categories?.map((category) => (
                                <Table.Tr key={category?.id}>
                                    <Table.Th>
                                        <Badge>{category?.id}</Badge>
                                    </Table.Th>
                                    <Table.Th>
                                        {category?.name?.toUpperCase()}
                                    </Table.Th>
                                    <Table.Th>
                                        <Group>
                                            <ColorSwatch
                                                color={category?.color || "brand"}
                                            />
                                            <Text c={category?.color} fw={600}>
                                                {category?.color?.toUpperCase()}
                                            </Text>
                                        </Group>
                                    </Table.Th>
                                    <Table.Th>
                                        <Group>
                                            <MDIcon>{category?.icon}</MDIcon>
                                            <Text>{category?.icon}</Text>
                                        </Group>
                                    </Table.Th>
                                    <Table.Th>
                                        <Group justify="center">
                                            <ActionIcon
                                                variant="transparent"
                                                onClick={() => {
                                                    setSelectedCategory(category);
                                                    editOpen();
                                                }}
                                            >
                                                <MDIcon>edit</MDIcon>
                                            </ActionIcon>
                                            <ActionIcon
                                                variant="transparent"
                                                onClick={() =>
                                                    openDeleteCategoryModal(category)
                                                }
                                            >
                                                <MDIcon color={"red"}>
                                                    delete
                                                </MDIcon>
                                            </ActionIcon>
                                        </Group>
                                    </Table.Th>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                </Paper>
            </Flex>
            <CategoryCreateModal
                setRefresh={() => {
                    setRefresh((prev) => prev + 1);
                }}
                opened={createOpened}
                onClose={createClose}
                centered
            />
            <CategoryEditModal
                setRefresh={() => {
                    setRefresh((prev) => prev + 1);
                }}
                opened={editOpened}
                onClose={editClose}
                categoryID={Number(selectedCategory?.id)}
                centered
            />
        </>
    );
}
