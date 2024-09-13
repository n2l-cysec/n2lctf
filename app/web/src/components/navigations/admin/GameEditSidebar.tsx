import MDIcon from "@/components/ui/MDIcon";
import { Button, Divider, Stack, StackProps } from "@mantine/core";
import { useLocation, useNavigate, useParams } from "react-router-dom";

interface GameEditSidebarProps extends StackProps {}

export default function GameEditSidebar(props: GameEditSidebarProps) {
    const { ...stackProps } = props;

    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const path = location.pathname.split(`/admin/games/${id}`)[1];
    const navigate = useNavigate();

    return (
        <Stack miw={175} {...stackProps}>
            <Button
                size="md"
                leftSection={<MDIcon c={"white"}>arrow_back</MDIcon>}
                onClick={() => navigate(`/admin/games`)}
            >
                Return to previous page
            </Button>
            <Divider my={5} />
            <Stack gap={10}>
                <Button
                    variant={path === "" ? "filled" : "subtle"}
                    onClick={() => navigate(`/admin/games/${id}`)}
                    leftSection={
                        <MDIcon c={path === "" ? "white" : "brand"}>
                            info
                        </MDIcon>
                    }
                >
                    Basic Information
                </Button>
                <Button
                    variant={path === "/challenges" ? "filled" : "subtle"}
                    onClick={() => navigate(`/admin/games/${id}/challenges`)}
                    leftSection={
                        <MDIcon c={path === "/challenges" ? "white" : "brand"}>
                            collections_bookmark
                        </MDIcon>
                    }
                >
                    subject
                </Button>
                <Button
                    variant={path === "/teams" ? "filled" : "subtle"}
                    onClick={() => navigate(`/admin/games/${id}/teams`)}
                    leftSection={
                        <MDIcon c={path === "/teams" ? "white" : "brand"}>
                            people
                        </MDIcon>
                    }
                >
                    Teams
                </Button>
                <Button
                    variant={path === "/submissions" ? "filled" : "subtle"}
                    onClick={() => navigate(`/admin/games/${id}/submissions`)}
                    leftSection={
                        <MDIcon c={path === "/submissions" ? "white" : "brand"}>
                            verified
                        </MDIcon>
                    }
                >
                    Submit Records
                </Button>
                <Button
                    variant={path === "/notices" ? "filled" : "subtle"}
                    onClick={() => navigate(`/admin/games/${id}/notices`)}
                    leftSection={
                        <MDIcon c={path === "/notices" ? "white" : "brand"}>
                            campaign
                        </MDIcon>
                    }
                >
                    announcement
                </Button>
            </Stack>
        </Stack>
    );
}
