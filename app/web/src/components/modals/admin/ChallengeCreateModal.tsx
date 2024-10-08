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
    SimpleGrid,
    Select,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useEffect } from "react";
import { z } from "zod";
import { useCategoryStore } from "@/stores/category";
import { createChallenge } from "@/api/challenge";

interface ChallengeCreateModalProps extends ModalProps {
    setRefresh: () => void;
}

export default function ChallengeCreateModal(props: ChallengeCreateModalProps) {
    const { setRefresh, ...modalProps } = props;

    const categoryStore = useCategoryStore();

    const form = useForm({
        mode: "controlled",
        initialValues: {
            title: "",
            description: "",
            category_id: 0,
        },
        validate: zodResolver(
            z.object({
                title: z.string(),
                category_id: z.number(),
            })
        ),
    });

    function handleCreateChallenge() {
        createChallenge({
            title: form.getValues().title,
            description: form.getValues().description,
            category_id: form.getValues().category_id,
        }).then((_) => {
            showSuccessNotification({
                message: `subject ${form.getValues().title} Create Success`,
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
                            <Text fw={600}>Create a subject</Text>
                        </Flex>
                        <Divider my={10} />
                        <Box p={10}>
                            <form
                                onSubmit={form.onSubmit((_) =>
                                    handleCreateChallenge()
                                )}
                            >
                                <Stack gap={10}>
                                    <SimpleGrid cols={2}>
                                        <TextInput
                                            label="Title"
                                            withAsterisk
                                            key={form.key("title")}
                                            {...form.getInputProps("title")}
                                        />
                                        <Select
                                            label="Category"
                                            withAsterisk
                                            data={categoryStore?.categories?.map(
                                                (category) => {
                                                    return {
                                                        value: String(
                                                            category.id
                                                        ),
                                                        label: String(
                                                            category.name
                                                        ),
                                                    };
                                                }
                                            )}
                                            allowDeselect={false}
                                            value={String(
                                                form.getValues().category_id
                                            )}
                                            onChange={(value) => {
                                                form.setFieldValue(
                                                    "category_id",
                                                    Number(value)
                                                );
                                            }}
                                        />
                                    </SimpleGrid>
                                    <Textarea
                                        label="Challenge Details"
                                        autosize
                                        minRows={5}
                                        maxRows={5}
                                        resize="vertical"
                                        key={form.key("description")}
                                        {...form.getInputProps("description")}
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
