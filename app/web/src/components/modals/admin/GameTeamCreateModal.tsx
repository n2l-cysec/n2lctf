import MDIcon from "@/components/ui/MDIcon";
import {
    showSuccessNotification,
    showErrNotification,
} from "@/utils/notification";
import {
    Box,
    Button,
    Card,
    Divider,
    Flex,
    Group,
    Input,
    Modal,
    ModalProps,
    Stack,
    Text,
    Avatar,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Team } from "@/types/team";
import TeamSelectModal from "./TeamSelectModal";
import { createGameTeam } from "@/api/game";

interface GameTeamCreateModalProps extends ModalProps {
    setRefresh: () => void;
}

export default function GameTeamCreateModal(props: GameTeamCreateModalProps) {
    const { setRefresh, ...modalProps } = props;

    const { id } = useParams<{ id: string }>();

    const [team, setTeam] = useState<Team>();

    const [teamSelectOpened, { open: teamSelectOpen, close: teamSelectClose }] =
        useDisclosure(false);

    const form = useForm({
        mode: "controlled",
        initialValues: {
            team_id: 0,
        },
        validate: {
            team_id: (value) => {
                if (value === 0) {
                    return "Team cannot be empty";
                }
                return null;
            },
        },
    });

    useEffect(() => {
        if (team) {
            form.setFieldValue("team_id", Number(team?.id));
        }
    }, [team]);

    function handleCreateGameTeam() {
        createGameTeam({
            game_id: Number(id),
            team_id: form.getValues().team_id,
        })
            .then((_) => {
                showSuccessNotification({
                    message: `Team ${team?.name} added successfully`,
                });
                setRefresh();
            })
            .catch((e) => {
                showErrNotification({
                    message: e.response.data.msg || "Failed to add team",
                });
            })
            .finally(() => {
                form.reset();
                modalProps.onClose();
            });
    }

    useEffect(() => {
        form.reset();
        setTeam(undefined);
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
                            <MDIcon>people</MDIcon>
                            <Text fw={600}>Add a team</Text>
                        </Flex>
                        <Divider my={10} />
                        <Box p={10}>
                            <form
                                onSubmit={form.onSubmit((_) =>
                                    handleCreateGameTeam()
                                )}
                            >
                                <Stack gap={10}>
                                    <Input.Wrapper label="team" size="md">
                                        <Button
                                            size="lg"
                                            onClick={teamSelectOpen}
                                            justify="start"
                                            fullWidth
                                            variant="light"
                                        >
                                            {team && (
                                                <>
                                                    <Group gap={15}>
                                                        <Avatar
                                                            color="brand"
                                                            src={`/api/teams/${team?.id}/avatar`}
                                                            radius="xl"
                                                        >
                                                            <MDIcon>
                                                                people
                                                            </MDIcon>
                                                        </Avatar>
                                                        <Text
                                                            fw={700}
                                                            size="1rem"
                                                        >
                                                            {team?.name}
                                                        </Text>
                                                    </Group>
                                                </>
                                            )}
                                            {!team && "Select Team"}
                                        </Button>
                                    </Input.Wrapper>
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
            <TeamSelectModal
                opened={teamSelectOpened}
                setTeam={setTeam}
                onClose={teamSelectClose}
            />
        </>
    );
}
