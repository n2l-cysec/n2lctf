import { Team } from "@/types/team";
import {
    showErrNotification,
    showSuccessNotification,
} from "@/utils/notification";
import {
    Card,
    Flex,
    Modal,
    ModalProps,
    Text,
    Divider,
    Box,
    Stack,
    TextInput,
    Textarea,
    Button,
    ActionIcon,
    Avatar,
    Tooltip,
    Group,
    Center,
    Image,
} from "@mantine/core";
import { isEmail, useForm } from "@mantine/form";
import MDIcon from "@/components/ui/MDIcon";
import { useEffect, useState } from "react";
import { modals } from "@mantine/modals";
import { User } from "@/types/user";
import { AxiosRequestConfig } from "axios";
import { Dropzone } from "@mantine/dropzone";
import {
    deleteTeamUser,
    getTeamAvatarMetadata,
    getTeamInviteToken,
    getTeams,
    saveTeamAvatar,
    updateTeam,
    updateTeamInviteToken,
} from "@/api/team";
import { Metadata } from "@/types/media";

interface TeamEditModalProps extends ModalProps {
    setRefresh: () => void;
    teamID: number;
}

export default function TeamEditModal(props: TeamEditModalProps) {
    const { setRefresh, teamID, ...modalProps } = props;

    const [team, setTeam] = useState<Team>();
    const [inviteToken, setInviteToken] = useState<string>("");
    const [avatarMetadata, setAvatarMetadata] = useState<Metadata>();

    const form = useForm({
        mode: "controlled",
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

    function handleGetTeam() {
        getTeams({
            id: teamID,
        }).then((res) => {
            const r = res.data;
            setTeam(r.data[0]);
        });
    }

    function handleGetTeamAvatarMetadata() {
        getTeamAvatarMetadata(team?.id!).then((res) => {
            const r = res.data;
            setAvatarMetadata(r.data);
        });
    }

    function handleSaveTeamAvatar(file?: File) {
        const config: AxiosRequestConfig<FormData> = {};
        saveTeamAvatar(Number(team?.id), file!, config)
            .then((_) => {
                showSuccessNotification({
                    message: `团队 ${form.getValues().name} 头像Update Success`,
                });
            })
            .finally(() => {
                handleGetTeam();
                setRefresh();
            });
    }

    function handleGetTeamInviteToken() {
        getTeamInviteToken({
            id: Number(teamID),
        }).then((res) => {
            const r = res.data;
            setInviteToken(r.token);
        });
    }

    function handleUpdateTeamInviteToken() {
        updateTeamInviteToken({
            id: Number(team?.id),
        }).then((res) => {
            const r = res.data;
            setInviteToken(r.token);
            showSuccessNotification({
                message: `Team ${team?.name} Invitation Code Update Success`,
            });
        });
    }

    function handleUpdateTeam() {
        updateTeam({
            id: Number(team?.id),
            name: form.getValues().name,
            description: form.getValues().description,
            email: form.getValues().email,
        })
            .then((_) => {
                showSuccessNotification({
                    message: `Team ${form.values.name} Update Success`,
                });
                setRefresh();
            })
            .catch((e) => {
                showErrNotification({
                    message: e.response.data.error || "Update team failed",
                });
            })
            .finally(() => {
                form.reset();
                modalProps.onClose();
            });
    }

    function handleTransferCaptain(user?: User) {
        updateTeam({
            id: Number(team?.id),
            captain_id: Number(user?.id),
        })
            .then((_) => {
                showSuccessNotification({
                    message: `Team ${form.values.name} Transfer Success`,
                });
                setRefresh();
            })
            .catch((e) => {
                showErrNotification({
                    message: e.response.data.error || "Failed to transfer team",
                });
            })
            .finally(() => {
                form.reset();
                modalProps.onClose();
            });
    }

    function handleDeleteTeamUser(user?: User) {
        deleteTeamUser({
            id: Number(team?.id),
            user_id: Number(user?.id),
        }).then((_) => {
            showSuccessNotification({
                message: `User ${user?.nickname} Kicked out`,
            });
            setRefresh();
            handleGetTeam();
        });
    }

    const openDeleteTeamUserModal = (user?: User) =>
        modals.openConfirmModal({
            centered: true,
            children: (
                <>
                    <Flex gap={10} align={"center"}>
                        <MDIcon>person_remove</MDIcon>
                        <Text fw={600}>Kick out members</Text>
                    </Flex>
                    <Divider my={10} />
                    <Text>Are you sure you want to kick the member {user?.nickname} out?</Text>
                </>
            ),
            withCloseButton: false,
            labels: {
                confirm: "Sure",
                cancel: "Cancel",
            },
            confirmProps: {
                color: "red",
            },
            onConfirm: () => {
                handleDeleteTeamUser(user);
            },
        });

    const openTransferCaptainModal = (user?: User) =>
        modals.openConfirmModal({
            centered: true,
            children: (
                <>
                    <Flex gap={10} align={"center"}>
                        <MDIcon color={"orange"}>star</MDIcon>
                        <Text fw={600}>Transfer Captain</Text>
                    </Flex>
                    <Divider my={10} />
                    <Text>Are you sure you want to transfer captaincy to {user?.nickname}?</Text>
                </>
            ),
            withCloseButton: false,
            labels: {
                confirm: "Sure",
                cancel: "Cancel",
            },
            onConfirm: () => {
                handleTransferCaptain(user);
            },
        });

    useEffect(() => {
        if (team) {
            form.setValues({
                name: team?.name,
                description: team?.description,
                email: team?.email,
            });
        }
    }, [team]);

    useEffect(() => {
        if (modalProps.opened && teamID) {
            handleGetTeam();
            handleGetTeamAvatarMetadata();
            handleGetTeamInviteToken();
        }
        if (!modalProps.opened) {
            setTimeout(() => {
                setTeam(undefined);
                form.reset();
            }, 100);
        }
    }, [teamID, modalProps.opened]);

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
                            <Text fw={600}>Team Details</Text>
                        </Flex>
                        <Divider my={10} />
                        <Box p={10}>
                            <form
                                onSubmit={form.onSubmit((_) =>
                                    handleUpdateTeam()
                                )}
                            >
                                <Stack gap={10}>
                                    <Flex gap={10}>
                                        <Stack gap={10} flex={1}>
                                            <TextInput
                                                label="Team Name"
                                                size="md"
                                                leftSection={
                                                    <MDIcon>people</MDIcon>
                                                }
                                                key={form.key("name")}
                                                {...form.getInputProps("name")}
                                            />
                                            <TextInput
                                                label="Invite Code"
                                                size="md"
                                                readOnly
                                                rightSection={
                                                    <ActionIcon
                                                        onClick={
                                                            handleUpdateTeamInviteToken
                                                        }
                                                    >
                                                        <MDIcon>refresh</MDIcon>
                                                    </ActionIcon>
                                                }
                                                value={`${team?.id}:${inviteToken}`}
                                            />
                                        </Stack>
                                        <Dropzone
                                            onDrop={(files: any) =>
                                                handleSaveTeamAvatar(files[0])
                                            }
                                            onReject={() => {
                                                showErrNotification({
                                                    message: "File upload failed",
                                                });
                                            }}
                                            h={150}
                                            w={150}
                                            accept={[
                                                "image/png",
                                                "image/gif",
                                                "image/jpeg",
                                                "image/webp",
                                                "image/avif",
                                                "image/heic",
                                            ]}
                                        >
                                            <Center
                                                style={{
                                                    pointerEvents: "none",
                                                }}
                                            >
                                                {avatarMetadata ? (
                                                    <Center>
                                                        <Image
                                                            w={120}
                                                            h={120}
                                                            fit="contain"
                                                            src={`/api/teams/${team?.id}/avatar`}
                                                        />
                                                    </Center>
                                                ) : (
                                                    <Center>
                                                        <Stack gap={0}>
                                                            <Text
                                                                size="xl"
                                                                inline
                                                            >
                                                                Drag or click to upload an avatar
                                                            </Text>
                                                            <Text
                                                                size="sm"
                                                                c="dimmed"
                                                                inline
                                                                mt={7}
                                                            >
                                                                The image size should not exceed
                                                                3MB
                                                            </Text>
                                                        </Stack>
                                                    </Center>
                                                )}
                                            </Center>
                                        </Dropzone>
                                    </Flex>
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
                                <Stack mt={10}>
                                    <Text>Member</Text>
                                    <Group gap={20}>
                                        {team?.users?.map((user) => (
                                            <Flex
                                                key={user?.id}
                                                align={"center"}
                                                gap={15}
                                            >
                                                <Flex align={"center"} gap={10}>
                                                    <Avatar
                                                        color="brand"
                                                        src={`/api/users/${user?.id}/avatar`}
                                                        radius="xl"
                                                    >
                                                        <MDIcon>person</MDIcon>
                                                    </Avatar>
                                                    <Text>
                                                        {user?.nickname}
                                                    </Text>
                                                </Flex>
                                                {user?.id ===
                                                    team?.captain_id && (
                                                    <Tooltip
                                                        label="Team Leader"
                                                        withArrow
                                                    >
                                                        <MDIcon
                                                            color={"yellow"}
                                                        >
                                                            star
                                                        </MDIcon>
                                                    </Tooltip>
                                                )}
                                                {user?.id !==
                                                    team?.captain_id && (
                                                    <Flex>
                                                        <Tooltip
                                                            label="Transfer Captain"
                                                            withArrow
                                                        >
                                                            <ActionIcon
                                                                color="grey"
                                                                onClick={() => {
                                                                    openTransferCaptainModal(
                                                                        user
                                                                    );
                                                                }}
                                                            >
                                                                <MDIcon>
                                                                    star
                                                                </MDIcon>
                                                            </ActionIcon>
                                                        </Tooltip>
                                                        <Tooltip
                                                            label="Kick Out"
                                                            withArrow
                                                        >
                                                            <ActionIcon
                                                                color="red"
                                                                onClick={() => {
                                                                    openDeleteTeamUserModal(
                                                                        user
                                                                    );
                                                                }}
                                                            >
                                                                <MDIcon>
                                                                    close
                                                                </MDIcon>
                                                            </ActionIcon>
                                                        </Tooltip>
                                                    </Flex>
                                                )}
                                            </Flex>
                                        ))}
                                    </Group>
                                </Stack>
                                <Flex mt={20} justify={"end"} gap={10}>
                                    <Button
                                        type="submit"
                                        leftSection={
                                            <MDIcon c={"white"}>check</MDIcon>
                                        }
                                    >
                                        Renew
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
