import {
    showErrNotification,
    showSuccessNotification,
} from "@/utils/notification";
import {
    Box,
    Card,
    Divider,
    Flex,
    Modal,
    ModalProps,
    Text,
    TextInput,
    Button,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import MDIcon from "@/components/ui/MDIcon";
import { joinTeam } from "@/api/team";

interface TeamJoinModalProps extends ModalProps {
    setRefresh: () => void;
}

export default function TeamJoinModal(props: TeamJoinModalProps) {
    const { setRefresh, ...modalProps } = props;

    const form = useForm({
        initialValues: {
            inviteToken: "",
        },
        validate: {
            inviteToken: (value) => {
                if (value.split(":").length != 2) {
                    return "Invitation code format Error";
                }
                return null;
            },
        },
    });

    function handleJoinTeam() {
        joinTeam({
            id: Number(form.getValues().inviteToken.split(":")[0]),
            token: form.getValues().inviteToken.split(":")[1],
        })
            .then((_) => {
                showSuccessNotification({
                    message: "Join the team successfully",
                });
            })
            .catch((_) => {
                showErrNotification({
                    message: "The invitation code is invalid or the team has been locked",
                });
            })
            .finally(() => {
                modalProps.onClose();
                setRefresh();
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
                            <MDIcon>waving_hand</MDIcon>
                            <Text fw={600}>Join the team</Text>
                        </Flex>
                        <Divider my={10} />
                        <Box p={10}>
                            <form
                                onSubmit={form.onSubmit((_) => {
                                    handleJoinTeam();
                                })}
                            >
                                <TextInput
                                    label="Invite Code"
                                    size="md"
                                    placeholder="n:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                                    key={form.key("inviteToken")}
                                    {...form.getInputProps("inviteToken")}
                                />
                                <Flex mt={20} justify={"end"}>
                                    <Button
                                        type="submit"
                                        leftSection={
                                            <MDIcon c={"white"}>check</MDIcon>
                                        }
                                    >
                                       join in
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
