import MDIcon from "@/components/ui/MDIcon";
import { Button, Divider, Stack, StackProps } from "@mantine/core";
import { useLocation, useNavigate, useParams } from "react-router-dom";

interface ChallengeEditSidebarProps extends StackProps {}

export default function ChallengeEditSidebar(props: ChallengeEditSidebarProps) {
    const { ...stackProps } = props;

    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const path = location.pathname.split(`/admin/challenges/${id}`)[1];
    const navigate = useNavigate();

    return (
        <Stack miw={175} {...stackProps}>
            <Button
                size="md"
                leftSection={<MDIcon c={"white"}>arrow_back</MDIcon>}
                onClick={() => navigate(`/admin/challenges`)}
            >
                Return to previous page
            </Button>
            <Divider my={5} />
            <Stack gap={10}>
                <Button
                    variant={path === "" ? "filled" : "subtle"}
                    onClick={() => navigate(`/admin/challenges/${id}`)}
                    leftSection={
                        <MDIcon c={path === "" ? "white" : "brand"}>
                            info
                        </MDIcon>
                    }
                >
                    Basic Information
                </Button>
                <Button
                    variant={path === "/flags" ? "filled" : "subtle"}
                    onClick={() => navigate(`/admin/challenges/${id}/flags`)}
                    leftSection={
                        <MDIcon c={path === "/flags" ? "white" : "brand"}>
                            flag
                        </MDIcon>
                    }
                >
                    Flags
                </Button>
                <Button
                    variant={path === "/container" ? "filled" : "subtle"}
                    onClick={() =>
                        navigate(`/admin/challenges/${id}/container`)
                    }
                    leftSection={
                        <MDIcon c={path === "/container" ? "white" : "brand"}>
                            package_2
                        </MDIcon>
                    }
                >
                    container
                </Button>
                <Button
                    variant={path === "/submissions" ? "filled" : "subtle"}
                    onClick={() =>
                        navigate(`/admin/challenges/${id}/submissions`)
                    }
                    leftSection={
                        <MDIcon c={path === "/submissions" ? "white" : "brand"}>
                            verified
                        </MDIcon>
                    }
                >
                    Submit Records
                </Button>
            </Stack>
        </Stack>
    );
}
