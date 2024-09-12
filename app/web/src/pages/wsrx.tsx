import { useEffect } from "react";
import { useConfigStore } from "@/stores/config";
import {
    ActionIcon,
    Blockquote,
    Box,
    Card,
    Checkbox,
    Divider,
    Flex,
    Indicator,
    Stack,
    Text,
    TextInput,
    Tooltip,
} from "@mantine/core";
import MDIcon from "@/components/ui/MDIcon";
import { useWsrxStore } from "@/stores/wsrx";

export default function Page() {
    const configStore = useConfigStore();
    const wsrxStore = useWsrxStore();

    useEffect(() => {
        document.title = `${configStore?.pltCfg?.site?.title}`;
    }, []);

    return (
        <>
            <Box
                sx={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                }}
                className={"no-select"}
            >
                <Card
                    shadow="md"
                    padding={"lg"}
                    radius={"md"}
                    withBorder
                    w={"40rem"}
                >
                    <Flex gap={10} align={"center"}>
                        <MDIcon>link</MDIcon>
                        <Text fw={600}>Connector</Text>
                    </Flex>
                    <Indicator
                        processing
                        pos={"absolute"}
                        right={25}
                        top={25}
                        color={
                            wsrxStore.status === "online"
                                ? "green"
                                : wsrxStore.status === "offline"
                                  ? "red"
                                  : "orange"
                        }
                    />
                    <Blockquote color="blue" p={10} my={20}>
                        <Flex align={"center"} gap={10}>
                            <Text fz={"sm"}>
                                This platform uses WebSocketReflectorX (hereinafter referred to as WSRX)
                                as the connector for enabling TCP over WebSocket
                                proxy containers. The following settings are used to interact with WSRX
                                and improve the user experience.
                            </Text>
                            <ActionIcon
                                onClick={() => {
                                    window.open(
                                        "https://github.com/XDSEC/WebSocketReflectorX",
                                        "_blank"
                                    );
                                }}
                            >
                                <MDIcon>download</MDIcon>
                            </ActionIcon>
                        </Flex>
                    </Blockquote>
                    <Stack>
                        <TextInput
                            label={"URL"}
                            value={wsrxStore?.url}
                            onChange={(e) => {
                                wsrxStore.setUrl(e.target.value);
                            }}
                            placeholder={"http://127.0.0.1:3307"}
                            rightSectionWidth={80}
                            rightSection={
                                <Flex>
                                    <Divider mx={10} orientation={"vertical"} />
                                    <Tooltip withArrow label={"Reconnect"}>
                                        <ActionIcon
                                            onClick={() => wsrxStore.connect()}
                                        >
                                            <MDIcon>refresh</MDIcon>
                                        </ActionIcon>
                                    </Tooltip>
                                </Flex>
                            }
                        />
                        <Checkbox
                            label={
                                "Enable Connector (If not enabled, you need to manually connect to the environment)"
                            }
                            checked={wsrxStore?.isEnabled}
                            onChange={(e) => {
                                wsrxStore?.setIsEnabled(e.target.checked);
                            }}
                        />
                    </Stack>
                </Card>
            </Box>
        </>
    );
}
