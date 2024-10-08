import { getChallenges } from "@/api/challenge";
import { deleteSubmission, getSubmissions } from "@/api/submission";
import withChallengeEdit from "@/components/layouts/admin/withChallengeEdit";
import MDIcon from "@/components/ui/MDIcon";
import { Challenge } from "@/types/challenge";
import { Submission } from "@/types/submission";
import { showSuccessNotification } from "@/utils/notification";
import {
    Divider,
    Group,
    Stack,
    Text,
    Table,
    Pagination,
    Flex,
    Badge,
    Avatar,
    ActionIcon,
    Tooltip,
    LoadingOverlay,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Page() {
    const { id } = useParams<{ id: string }>();

    const [challenge, setChallenge] = useState<Challenge>();
    const [submissions, setSubmissions] = useState<Array<Submission>>([]);

    const [total, setTotal] = useState<number>(0);
    const [rowsPerPage, _] = useState<number>(10);
    const [page, setPage] = useState<number>(1);

    const [refresh, setRefresh] = useState<number>(0);

    const [loading, setLoading] = useState<boolean>(false);

    const statusMap = new Map<number, { color: string; label: string }>([
        [
            0,
            {
                color: "gray",
                label: "Unjudged",
            },
        ],
        [
            1,
            {
                color: "green",
                label: "Accepted",
            },
        ],
        [
            2,
            {
                color: "red",
                label: "Wrong",
            },
        ],
        [
            3,
            {
                color: "orange",
                label: "Cheat",
            },
        ],
        [
            4,
            {
                color: "blue",
                label: "Invalid",
            },
        ],
    ]);

    function handleGetChallenge() {
        getChallenges({
            id: Number(id),
        }).then((res) => {
            const r = res.data;
            setChallenge(r.data[0]);
        });
    }

    function handleGetSubmissions() {
        setLoading(true);
        getSubmissions({
            challenge_id: Number(id),
            page: page,
            size: rowsPerPage,
            is_detailed: true,
        })
            .then((res) => {
                const r = res.data;
                setSubmissions(r.data);
                setTotal(r.total);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    function handleDeleteSubmission(submission?: Submission) {
        if (submission) {
            deleteSubmission({
                id: submission?.id,
            }).then(() => {
                showSuccessNotification({
                    message: "Submission record removed",
                });
                setRefresh((prev) => prev + 1);
            });
        }
    }

    const openDeleteSubmissionModal = (submission?: Submission) =>
        modals.openConfirmModal({
            centered: true,
            children: (
                <>
                    <Flex gap={10} align={"center"}>
                        <MDIcon>verified</MDIcon>
                        <Text fw={600}>Delete Submission Record</Text>
                    </Flex>
                    <Divider my={10} />
                    <Text>Are you sure you want to delete the submission record for {submission?.flag}?</Text>
                </>
            ),
            withCloseButton: false,
            labels: {
                confirm: "Yes",
                cancel: "No",
            },
            confirmProps: {
                color: "red",
            },
            onConfirm: () => {
                handleDeleteSubmission(submission);
            },
        });

    useEffect(() => {
        if (challenge) {
            handleGetSubmissions();
        }
    }, [challenge, page, rowsPerPage, refresh]);

    useEffect(() => {
        handleGetChallenge();
    }, []);

    useEffect(() => {
        document.title = `Submission Records - ${challenge?.title}`;
    }, [challenge]);

    return (
        <>
            <Stack m={36}>
                <Stack gap={10}>
                    <Group>
                        <MDIcon>verified</MDIcon>
                        <Text fw={700} size="xl">
                            Submission Records
                        </Text>
                    </Group>
                    <Divider />
                </Stack>
                <Stack mx={20} mih={"calc(100vh - 360px)"} pos={"relative"}>
                    <LoadingOverlay visible={loading} />
                    <Table stickyHeader horizontalSpacing={"md"} striped>
                        <Table.Thead>
                            <Table.Tr
                                sx={{
                                    lineHeight: 3,
                                }}
                            >
                                <Table.Th />
                                <Table.Th>Flag</Table.Th>
                                <Table.Th>Related Game</Table.Th>
                                <Table.Th>Related Team</Table.Th>
                                <Table.Th>Submitter</Table.Th>
                                <Table.Th>Submission Time</Table.Th>
                                <Table.Th />
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {submissions?.map((submission) => (
                                <Table.Tr key={submission?.id}>
                                    <Table.Td>
                                        <Badge
                                            color={
                                                statusMap?.get(
                                                    Number(submission?.status)
                                                )?.color
                                            }
                                        >
                                            {
                                                statusMap?.get(
                                                    Number(submission?.status)
                                                )?.label
                                            }
                                        </Badge>
                                    </Table.Td>
                                    <Table.Td
                                        maw={200}
                                        sx={{
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {submission?.flag}
                                    </Table.Td>
                                    <Table.Td>
                                        {submission?.game?.title || "Practice Arena"}
                                    </Table.Td>
                                    <Table.Td>
                                        {submission?.team?.name ? (
                                            <Group gap={15}>
                                                <Avatar
                                                    color="brand"
                                                    src={`/api/teams/${submission?.team?.id}/avatar`}
                                                    radius="xl"
                                                >
                                                    <MDIcon>people</MDIcon>
                                                </Avatar>
                                                {submission?.team?.name}
                                            </Group>
                                        ) : (
                                            "None"
                                        )}
                                    </Table.Td>
                                    <Table.Td>
                                        <Group gap={15}>
                                            <Avatar
                                                color="brand"
                                                src={`/api/users/${submission?.user?.id}/avatar`}
                                                radius="xl"
                                            >
                                                <MDIcon>person</MDIcon>
                                            </Avatar>
                                            {submission?.user?.nickname}
                                        </Group>
                                    </Table.Td>
                                    <Table.Td>
                                        <Badge>
                                            {dayjs(
                                                Number(submission?.created_at)
                                            ).format("YYYY/MM/DD HH:mm:ss")}
                                        </Badge>
                                    </Table.Td>
                                    <Table.Td>
                                        <Group>
                                            <Tooltip
                                                withArrow
                                                label="Delete Submission Record"
                                            >
                                                <ActionIcon
                                                    onClick={() =>
                                                        openDeleteSubmissionModal(
                                                            submission
                                                        )
                                                    }
                                                >
                                                    <MDIcon color={"red"}>
                                                        delete
                                                    </MDIcon>
                                                </ActionIcon>
                                            </Tooltip>
                                        </Group>
                                    </Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                </Stack>
                <Flex justify={"center"}>
                    <Pagination
                        withEdges
                        total={Math.ceil(total / rowsPerPage)}
                        value={page}
                        onChange={setPage}
                    />
                </Flex>
            </Stack>
        </>
    );
}

export default withChallengeEdit(Page);
