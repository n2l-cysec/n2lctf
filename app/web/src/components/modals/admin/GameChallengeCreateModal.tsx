import {
    Card,
    Flex,
    Modal,
    ModalProps,
    Text,
    Divider,
    Stack,
    Button,
    Box,
    Input,
    Group,
    NumberInput,
} from "@mantine/core";
import MDIcon from "@/components/ui/MDIcon";
import { useForm } from "@mantine/form";
import {
    showErrNotification,
    showSuccessNotification,
} from "@/utils/notification";
import { useEffect, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { Challenge } from "@/types/challenge";
import ChallengeSelectModal from "./ChallengeSelectModal";
import { useParams } from "react-router-dom";
import { useCategoryStore } from "@/stores/category";
import { createGameChallenge } from "@/api/game";

interface GameChallengeCreateModalProps extends ModalProps {
    setRefresh: () => void;
}

export default function GameChallengeCreateModal(
    props: GameChallengeCreateModalProps
) {
    const { setRefresh, ...modalProps } = props;

    const { id } = useParams<{ id: string }>();

    const categoryStore = useCategoryStore();

    const [challenge, setChallenge] = useState<Challenge>();

    const [
        challengeSelectOpened,
        { open: challengeSelectOpen, close: challengeSelectClose },
    ] = useDisclosure(false);

    const form = useForm({
        mode: "controlled",
        initialValues: {
            max_pts: 1000,
            min_pts: 200,
            challenge_id: 0,
        },
        validate: {
            max_pts: (value) => {
                if (value === 0) {
                    return "The maximum score cannot be empty";
                }
                if (value < form.getValues().min_pts) {
                    return "The maximum score cannot be less than the minimum score";
                }
                return null;
            },
            min_pts: (value) => {
                if (value === 0) {
                    return "Minimum score cannot be empty";
                }
                if (value > form.getValues().max_pts) {
                    return "The minimum score cannot be greater than the maximum score";
                }
                return null;
            },
            challenge_id: (value) => {
                if (value === 0) {
                    return "subject Cannot be empty";
                }
                return null;
            },
        },
    });

    useEffect(() => {
        if (challenge) {
            form.setFieldValue("challenge_id", Number(challenge?.id));
        }
    }, [challenge]);

    function handleCreateGameChallenge() {
        createGameChallenge({
            game_id: Number(id),
            challenge_id: form.getValues().challenge_id,
            max_pts: form.getValues().max_pts,
            min_pts: form.getValues().min_pts,
            is_enabled: false,
        })
            .then((_) => {
                showSuccessNotification({
                    message: `subject ${challenge?.title} Added successfully`,
                });
                setRefresh();
            })
            .catch((e) => {
                showErrNotification({
                    message: e.response.data.error || "Failed to add subject",
                });
            })
            .finally(() => {
                form.reset();
                modalProps.onClose();
            });
    }

    useEffect(() => {
        form.reset();
        setChallenge(undefined);
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
                            <Text fw={600}>Add subject</Text>
                        </Flex>
                        <Divider my={10} />
                        <Box p={10}>
                            <form
                                onSubmit={form.onSubmit((_) =>
                                    handleCreateGameChallenge()
                                )}
                            >
                                <Stack gap={10}>
                                    <Input.Wrapper label="subject" size="md">
                                        <Button
                                            size="lg"
                                            onClick={challengeSelectOpen}
                                            justify="start"
                                            fullWidth
                                            variant="light"
                                        >
                                            {challenge && (
                                                <>
                                                    <Group gap={15}>
                                                        <MDIcon
                                                            color={
                                                                categoryStore.getCategory(
                                                                    challenge?.category_id!
                                                                )?.color
                                                            }
                                                        >
                                                            {
                                                                categoryStore.getCategory(
                                                                    challenge?.category_id!
                                                                )?.icon
                                                            }
                                                        </MDIcon>
                                                        <Text
                                                            fw={700}
                                                            size="1rem"
                                                        >
                                                            {challenge?.title}
                                                        </Text>
                                                    </Group>
                                                </>
                                            )}
                                            {!challenge && "选择subject"}
                                        </Button>
                                    </Input.Wrapper>
                                    <NumberInput
                                        label="Minimum value"
                                        withAsterisk
                                        description="The minimum score of this subject in the difficulty curve"
                                        size="md"
                                        key={form.key("min_pts")}
                                        {...form.getInputProps("min_pts")}
                                    />
                                    <NumberInput
                                        label="Maximum score"
                                        withAsterisk
                                        description="The maximum score of this subject in the difficulty curve"
                                        size="md"
                                        key={form.key("max_pts")}
                                        {...form.getInputProps("max_pts")}
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
            <ChallengeSelectModal
                opened={challengeSelectOpened}
                setChallenge={setChallenge}
                onClose={challengeSelectClose}
            />
        </>
    );
}
