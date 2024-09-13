import {
    deleteChallengeAttachment,
    getChallengeAttachmentMetadata,
    getChallenges,
    saveChallengeAttachment,
    updateChallenge,
} from "@/api/challenge";
import withChallengeEdit from "@/components/layouts/admin/withChallengeEdit";
import MDIcon from "@/components/ui/MDIcon";
import { useCategoryStore } from "@/stores/category";
import { useConfigStore } from "@/stores/config";
import { Challenge } from "@/types/challenge";
import { Metadata } from "@/types/media";
import {
    showLoadingNotification,
    showSuccessNotification,
} from "@/utils/notification";
import {
    ActionIcon,
    Button,
    Text,
    Divider,
    FileInput,
    Flex,
    Group,
    Select,
    Stack,
    TextInput,
    Textarea,
    Tooltip,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { AxiosRequestConfig } from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { z } from "zod";

function Page() {
    const configStore = useConfigStore();
    const categoryStore = useCategoryStore();

    const { id } = useParams<{ id: string }>();

    const [refresh, setRefresh] = useState<number>(0);

    const [challenge, setChallenge] = useState<Challenge>();
    const [attachmentMetadata, setAttachmentMetadata] = useState<Metadata>();

    const [attachment, setAttachment] = useState<File | null>(null);

    function handleGetChallenge() {
        getChallenges({
            id: Number(id),
            is_detailed: true,
        }).then((res) => {
            const r = res.data;
            setChallenge(r.data[0]);
        });
    }

    function handleGetAttachmentMetadata() {
        getChallengeAttachmentMetadata(Number(id)).then((res) => {
            const r = res.data;
            setAttachmentMetadata(r.data);
        });
    }

    function handleSaveAttachment() {
        showLoadingNotification({
            id: "upload-attachment",
            message: "Uploading attachment",
        });
        const config: AxiosRequestConfig<FormData> = {};
        saveChallengeAttachment(Number(id), attachment!, config).then((_) => {
            showSuccessNotification({
                id: "upload-attachment",
                message: "Attachment upload successful",
                update: true,
            });
            setRefresh((prev) => prev + 1);
        });
    }

    function handleDeleteAttachment() {
        deleteChallengeAttachment(Number(id)).then((_) => {
            showSuccessNotification({
                message: "Attachment deletion successful",
            });
            setRefresh((prev) => prev + 1);
        });
    }

    useEffect(() => {
        if (attachment) {
            handleSaveAttachment();
        }
    }, [attachment]);

    const form = useForm({
        mode: "controlled",
        initialValues: {
            title: "",
            description: "",
            category_id: 0,
        },
        validate: zodResolver(
            z.object({
                title: z.string({
                    required_error: "Title is required",
                }),
            })
        ),
    });

    function handleUpdateChallenge() {
        updateChallenge({
            id: Number(id),
            title: form.getValues().title,
            description: form.getValues().description,
            category_id: form.getValues().category_id,
        }).then((_) => {
            showSuccessNotification({
                message: `Challenge ${form.getValues().title} Update Success`,
            });
            setRefresh((prev) => prev + 1);
        });
    }

    useEffect(() => {
        setAttachment(null);
        handleGetChallenge();
    }, [refresh]);

    useEffect(() => {
        if (challenge) {
            form.setValues({
                title: challenge.title,
                description: challenge.description,
                category_id: challenge.category_id,
            });
            handleGetAttachmentMetadata();
        }
    }, [challenge]);

    useEffect(() => {
        document.title = `${challenge?.title} - ${configStore?.pltCfg?.site?.title}`;
    }, [challenge]);

    return (
        <>
            <Stack m={36}>
                <Stack gap={10}>
                    <Group>
                        <MDIcon>info</MDIcon>
                        <Text fw={700} size="xl">
                            Basic Information
                        </Text>
                    </Group>
                    <Divider />
                </Stack>
                <form onSubmit={form.onSubmit((_) => handleUpdateChallenge())}>
                    <Stack mx={20}>
                        <Group>
                            <TextInput
                                label="Title"
                                withAsterisk
                                description="Main title of the challenge"
                                flex={1}
                                key={form.key("title")}
                                {...form.getInputProps("title")}
                            />
                            <Select
                                label="Category"
                                withAsterisk
                                w={"20%"}
                                description="Challenge category"
                                data={categoryStore?.categories?.map(
                                    (category) => {
                                        return {
                                            value: String(category.id),
                                            label: String(category.name),
                                        };
                                    }
                                )}
                                allowDeselect={false}
                                value={String(form.getValues().category_id)}
                                onChange={(value) => {
                                    form.setFieldValue(
                                        "category_id",
                                        Number(value)
                                    );
                                }}
                            />
                        </Group>
                        <Textarea
                            label="Description"
                            description="Description of the challenge, supports Markdown"
                            autosize
                            minRows={9}
                            maxRows={9}
                            resize="vertical"
                            key={form.key("description")}
                            {...form.getInputProps("description")}
                        />
                        <Group align={"end"} gap={10}>
                            <TextInput
                                label="Attachment Name/Size"
                                disabled
                                flex={1}
                                value={
                                    attachmentMetadata?.filename
                                        ? `${attachmentMetadata?.filename} / ${attachmentMetadata?.size} bytes`
                                        : ""
                                }
                            />
                            <FileInput
                                label="Upload Attachment"
                                description="Upload a challenge attachment"
                                placeholder="Click here to upload attachment"
                                value={attachment}
                                onChange={setAttachment}
                            />
                            <Tooltip label="Clear Attachment" withArrow>
                                <ActionIcon
                                    my={7}
                                    onClick={() => handleDeleteAttachment()}
                                >
                                    <MDIcon color={"red"}>delete</MDIcon>
                                </ActionIcon>
                            </Tooltip>
                        </Group>

                        <Flex justify={"end"}>
                            <Button
                                type="submit"
                                size="md"
                                leftSection={<MDIcon c={"white"}>check</MDIcon>}
                            >
                                Save
                            </Button>
                        </Flex>
                    </Stack>
                </form>
            </Stack>
        </>
    );
}

export default withChallengeEdit(Page);
