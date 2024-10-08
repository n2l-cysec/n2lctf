import MDIcon from "@/components/ui/MDIcon";
import { useConfigStore } from "@/stores/config";
import { Game } from "@/types/game";
import {
    showErrNotification,
    showSuccessNotification,
} from "@/utils/notification";
import {
    ActionIcon,
    Flex,
    Group,
    Pagination,
    Paper,
    Select,
    Stack,
    Table,
    Text,
    TextInput,
    ThemeIcon,
    Badge,
    Switch,
    Tooltip,
    Image,
    Divider,
    LoadingOverlay,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import GameCreateModal from "@/components/modals/admin/GameCreateModal";
import { useNavigate } from "react-router-dom";
import { deleteGame, getGames, updateGame } from "@/api/game";

export default function Page() {
    const configStore = useConfigStore();
    const navigate = useNavigate();

    const [refresh, setRefresh] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);

    const [games, setGames] = useState<Array<Game>>([]);
    const [page, setPage] = useState<number>(1);
    const [total, setTotal] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(5);
    const [search, setSearch] = useState<string>("");
    const [searchInput, setSearchInput] = useState<string>("");
    const [sort, setSort] = useState<string>("id_asc");

    const [createOpened, { open: createOpen, close: createClose }] =
        useDisclosure(false);

    function handleGetGames() {
        setLoading(true);
        getGames({
            page: page,
            size: rowsPerPage,
            title: search,
            sort_key: sort.split("_")[0],
            sort_order: sort.split("_")[1],
        })
            .then((res) => {
                const r = res.data;
                setGames(r.data);
                setTotal(r.total);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    function handleDeleteGame(game?: Game) {
        deleteGame({
            id: Number(game?.id),
        })
            .then((_) => {
                showSuccessNotification({
                    message: `Game ${game?.title} has been deleted`,
                });
            })
            .catch((e) => {
                showErrNotification({
                    message: e.response.data.message,
                });
            })
            .finally(() => {
                setRefresh((prev) => prev + 1);
            });
    }

    function switchIsEnabled(game?: Game) {
        updateGame({
            id: Number(game?.id),
            is_enabled: !game?.is_enabled,
        })
            .then((_) => {
                showSuccessNotification({
                    message: !game?.is_enabled
                        ? `Game ${game?.title} has been published`
                        : `Game ${game?.title} has been unpublished`,
                });
            })
            .catch((e) => {
                showErrNotification({
                    message: e.response.data.message,
                });
            })
            .finally(() => {
                setRefresh((prev) => prev + 1);
            });
    }

    const openDeleteGameModal = (game?: Game) =>
        modals.openConfirmModal({
            centered: true,
            children: (
                <>
                    <Flex gap={10} align={"center"}>
                        <ThemeIcon variant="transparent">
                            <MDIcon>flag</MDIcon>
                        </ThemeIcon>
                        <Text fw={600}>Delete Game</Text>
                    </Flex>
                    <Divider my={10} />
                    <Text>Are you sure you want to delete the game {game?.title}?</Text>
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
                handleDeleteGame(game);
            },
        });

    useEffect(() => {
        handleGetGames();
    }, [search, page, rowsPerPage, sort, refresh]);

    useEffect(() => {
        document.title = `Game Management - ${configStore?.pltCfg?.site?.title}`;
    }, []);

    return (
        <>
            <Flex my={36} mx={"10%"} justify={"center"} gap={36}>
                <Stack w={"15%"} gap={0} visibleFrom={"lg"}>
                    <Flex justify={"space-between"} align={"center"}>
                        <TextInput
                            variant="filled"
                            placeholder="Search"
                            mr={5}
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            flex={1}
                        />
                        <ActionIcon
                            variant={"filled"}
                            onClick={() => setSearch(searchInput)}
                        >
                            <MDIcon size={15} c={"white"}>
                                search
                            </MDIcon>
                        </ActionIcon>
                    </Flex>
                    <Select
                        label="Items per page"
                        description="Select the number of games displayed per page"
                        value={String(rowsPerPage)}
                        allowDeselect={false}
                        data={["5", "10", "20", "50"]}
                        onChange={(_, option) =>
                            setRowsPerPage(Number(option.value))
                        }
                        mt={15}
                    />
                    <Select
                        label="Sort"
                        description="Select the sorting method for games"
                        value={sort}
                        allowDeselect={false}
                        data={[
                            {
                                label: "ID Ascending",
                                value: "id_asc",
                            },
                            {
                                label: "ID Descending",
                                value: "id_desc",
                            },
                            {
                                label: "Title Ascending",
                                value: "title_asc",
                            },
                            {
                                label: "Title Descending",
                                value: "title_desc",
                            },
                        ]}
                        onChange={(_, option) => setSort(option.value)}
                        mt={15}
                    />
                </Stack>
                <Stack
                    w={"85%"}
                    align="center"
                    gap={36}
                    mih={"calc(100vh - 10rem)"}
                >
                    <Paper w={"100%"} shadow={"md"} pos={"relative"} flex={1}>
                        <LoadingOverlay visible={loading} />
                        <Table stickyHeader horizontalSpacing={"md"} striped>
                            <Table.Thead>
                                <Table.Tr
                                    sx={{
                                        lineHeight: 3,
                                    }}
                                >
                                    <Table.Th>
                                        <Flex justify={"start"}>
                                            <Tooltip label="Publish to game page">
                                                <ThemeIcon variant="transparent">
                                                    <MDIcon>flag</MDIcon>
                                                </ThemeIcon>
                                            </Tooltip>
                                        </Flex>
                                    </Table.Th>
                                    <Table.Th>Title</Table.Th>
                                    <Table.Th>Time</Table.Th>
                                    <Table.Th>Status</Table.Th>
                                    <Table.Th>
                                        <Flex justify={"center"}>
                                            <ActionIcon onClick={createOpen}>
                                                <MDIcon>add</MDIcon>
                                            </ActionIcon>
                                        </Flex>
                                    </Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {games?.map((game) => {
                                    const status = () => {
                                        if (
                                            Number(game?.started_at) >
                                            Date.now() / 1000
                                        ) {
                                            return 0;
                                        } else if (
                                            Number(game?.started_at) <
                                                Date.now() / 1000 &&
                                            Date.now() / 1000 <
                                                Number(game?.ended_at)
                                        ) {
                                            return 1;
                                        } else {
                                            return 2;
                                        }
                                    };

                                    return (
                                        <Table.Tr key={game?.id}>
                                            <Table.Th>
                                                <Group wrap={"nowrap"}>
                                                    <Badge>{game?.id}</Badge>
                                                    <Switch
                                                        checked={
                                                            game?.is_enabled
                                                        }
                                                        onChange={() =>
                                                            switchIsEnabled(
                                                                game
                                                            )
                                                        }
                                                    />
                                                </Group>
                                            </Table.Th>
                                            <Table.Th p={0}>
                                                <Group gap={15} wrap={"nowrap"}>
                                                    <Image
                                                        src={`/api/games/${game?.id}/poster`}
                                                        fallbackSrc="https://placehold.co/600x400?text=Placeholder"
                                                        mih={150}
                                                        mah={150}
                                                        w={200}
                                                    />
                                                    <Text fw={700} size="1rem">
                                                        {game?.title}
                                                    </Text>
                                                </Group>
                                            </Table.Th>
                                            <Table.Th>
                                                <Group gap={5}>
                                                    <Badge>
                                                        {dayjs(
                                                            Number(
                                                                game?.started_at
                                                            ) * 1000
                                                        ).format(
                                                            "YYYY/MM/DD HH:mm:ss"
                                                        )}
                                                    </Badge>
                                                    <ThemeIcon variant="transparent">
                                                        <MDIcon>
                                                            arrow_right_alt
                                                        </MDIcon>
                                                    </ThemeIcon>
                                                    <Badge>
                                                        {dayjs(
                                                            Number(
                                                                game?.ended_at
                                                            ) * 1000
                                                        ).format(
                                                            "YYYY/MM/DD HH:mm:ss"
                                                        )}
                                                    </Badge>
                                                </Group>
                                            </Table.Th>
                                            <Table.Th>
                                                <Badge
                                                    size="lg"
                                                    color={
                                                        status() === 0
                                                            ? "orange"
                                                            : status() === 1
                                                              ? "brand"
                                                              : "red"
                                                    }
                                                >
                                                    {status() === 0
                                                        ? "Not Started"
                                                        : status() === 1
                                                          ? "Ongoing"
                                                          : "Ended"}
                                                </Badge>
                                            </Table.Th>
                                            <Table.Th>
                                                <Group
                                                    justify="center"
                                                    wrap={"nowrap"}
                                                >
                                                    <ActionIcon
                                                        onClick={() => {
                                                            navigate(
                                                                `/admin/games/${game?.id}`
                                                            );
                                                        }}
                                                    >
                                                        <MDIcon>edit</MDIcon>
                                                    </ActionIcon>
                                                    <ActionIcon
                                                        onClick={() =>
                                                            openDeleteGameModal(
                                                                game
                                                            )
                                                        }
                                                    >
                                                        <MDIcon color={"red"}>
                                                            delete
                                                        </MDIcon>
                                                    </ActionIcon>
                                                </Group>
                                            </Table.Th>
                                        </Table.Tr>
                                    );
                                })}
                            </Table.Tbody>
                        </Table>
                    </Paper>
                    <Pagination
                        total={Math.max(Math.ceil(total / rowsPerPage), 1)}
                        value={page}
                        onChange={setPage}
                        withEdges
                    />
                </Stack>
            </Flex>
            <GameCreateModal
                setRefresh={() => setRefresh((prev) => prev + 1)}
                opened={createOpened}
                onClose={createClose}
                centered
            />
        </>
    );
}
