import { Challenge, ChallengeStatus } from "@/types/challenge";
import {
    Badge,
    Box,
    Text,
    Card,
    Divider,
    Flex,
    Tooltip,
    ThemeIcon,
    useMantineTheme,
    Stack,
} from "@mantine/core";
import MDIcon from "@/components/ui/MDIcon";
import FirstBloodIcon from "@/components/icons/hexagons/FirstBloodIcon";
import SecondBloodIcon from "@/components/icons/hexagons/SecondBloodIcon";
import ThirdBloodIcon from "@/components/icons/hexagons/ThirdBloodIcon";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import styles from "./ChallengeCard.module.css";
import { useCategoryStore } from "@/stores/category";

export default function ChallengeCard({
    challenge,
    status,
}: {
    challenge?: Challenge;
    status?: ChallengeStatus;
}) {
    const theme = useMantineTheme();
    const categoryStore = useCategoryStore();

    const [color, setColor] = useState<string>("transparent");

    const bloodMap = [
        {
            name: "一血",
            icon: <FirstBloodIcon size={24} />,
        },
        {
            name: "二血",
            icon: <SecondBloodIcon size={24} />,
        },
        {
            name: "三血",
            icon: <ThirdBloodIcon size={24} />,
        },
    ];

    function getClassName(clazzName: string) {
        return status?.is_solved
            ? styles[`${clazzName}Solved`]
            : styles[clazzName];
    }

    useEffect(() => {
        setColor(
            categoryStore.getCategory(Number(challenge?.category_id))?.color ||
                theme.colors.brand[5]
        );
    }, []);

    return (
        <Card
            shadow="md"
            h={150}
            w={275}
            pos={"relative"}
            className={getClassName("card")}
            __vars={{
                "--color": color,
            }}
        >
            <Box pos={"absolute"} right={0} bottom={-20}>
                <MDIcon size={180} className={getClassName("bIcon")}>
                    {
                        categoryStore.getCategory(
                            Number(challenge?.category_id)
                        )?.icon
                    }
                </MDIcon>
            </Box>
            {status?.is_solved && (
                <Box pos={"absolute"} right={20} top={20}>
                    <Tooltip label="已解决">
                        <MDIcon size={30} color={"#FFF"}>
                            done
                        </MDIcon>
                    </Tooltip>
                </Box>
            )}
            <Box>
                <Badge variant="light" className={getClassName("badge")}>
                    {categoryStore.getCategory(challenge?.category_id!)?.name}
                </Badge>
            </Box>
            <Box py={10}>
                <Text
                    size="lg"
                    className={getClassName("text")}
                    fw={700}
                    sx={{
                        width: 200,
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                    }}
                >
                    {challenge?.title}
                </Text>
            </Box>
            <Divider py={5} className={getClassName("divider")} />
            <Flex justify={"space-between"} align={"center"} px={5}>
                {status?.pts ? (
                    <Tooltip
                        label={
                            <Text size={"xs"}>
                                {status?.solved_times || 0} 次解决
                            </Text>
                        }
                        withArrow
                        position="bottom"
                    >
                        <Text
                            size="lg"
                            fw={700}
                            className={
                                status?.is_solved
                                    ? styles.textSolved
                                    : styles.text
                            }
                        >
                            {status?.pts} pts
                        </Text>
                    </Tooltip>
                ) : (
                    <Text
                        size="lg"
                        fw={700}
                        className={
                            status?.is_solved ? styles.textSolved : styles.text
                        }
                    >
                        {status?.solved_times || 0} 次解决
                    </Text>
                )}
                <Flex align={"center"}>
                    {status?.bloods?.slice(0, 3)?.map((submission, index) => (
                        <Tooltip
                            key={submission?.id}
                            multiline
                            label={
                                <Stack gap={0}>
                                    <Text size={"sm"} fw={600}>
                                        {submission?.team?.name ||
                                            submission?.user?.nickname}
                                    </Text>
                                    <Text size={"xs"}>
                                        {dayjs(
                                            Number(submission?.created_at) *
                                                1000
                                        ).format("YYYY/MM/DD HH:mm:ss")}
                                    </Text>
                                </Stack>
                            }
                            withArrow
                            position="bottom"
                        >
                            <ThemeIcon>{bloodMap[index]?.icon}</ThemeIcon>
                        </Tooltip>
                    ))}
                </Flex>
            </Flex>
        </Card>
    );
}
