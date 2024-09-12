import MDIcon from "@/components/ui/MDIcon";
import { useAuthStore } from "@/stores/auth";
import { useConfigStore } from "@/stores/config";
import { Box, Button, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    showErrNotification,
    showSuccessNotification,
} from "@/utils/notification";
import { login } from "@/api/user";

export default function Page() {
    const configStore = useConfigStore();
    const navigate = useNavigate();
    const authStore = useAuthStore();

    useEffect(() => {
        document.title = `Login - ${configStore?.pltCfg?.site?.title}`;
    }, []);

    const [loginLoading, setLoginLoading] = useState(false);

    const form = useForm({
        mode: "controlled",
        initialValues: {
            account: "",
            password: "",
        },

        validate: {
            account: (value) => {
                if (value === "") {
                    return "Account cannot be empty";
                }
                return null;
            },
            password: (value) => {
                if (value === "") {
                    return "Password cannot be empty";
                }
                return null;
            },
        },
    });

    function handleLogin() {
        setLoginLoading(true);
        login({
            account: form.getValues().account?.toLowerCase(),
            password: form.getValues().password,
        })
            .then((res) => {
                const r = res.data;
                authStore.setPgsToken(r?.token);
                authStore.setUser(r?.data);
                showSuccessNotification({
                    title: "Login Successful",
                    message: `Welcome to ${configStore?.pltCfg?.site?.title}`,
                });
                navigate("/");
                console.log(res);
            })
            .catch((err) => {
                showErrNotification({
                    title: "An Error Occurred",
                    message: `Login Failed ${err}`,
                });
            })
            .finally(() => {
                setLoginLoading(false);
            });
    }

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
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        marginTop: "2rem",
                    }}
                >
                    <form onSubmit={form.onSubmit((_) => handleLogin())}>
                        <TextInput
                            label="Username/Email"
                            size="lg"
                            leftSection={<MDIcon>person</MDIcon>}
                            key={form.key("account")}
                            {...form.getInputProps("account")}
                        />
                        <TextInput
                            label="Password"
                            type="password"
                            size="lg"
                            leftSection={<MDIcon>lock</MDIcon>}
                            mt={10}
                            key={form.key("password")}
                            {...form.getInputProps("password")}
                        />
                        <Button
                            loading={loginLoading}
                            size={"lg"}
                            fullWidth
                            sx={{ marginTop: "2rem", bgcolor: "primary.700" }}
                            type="submit"
                        >
                            Login
                        </Button>
                    </form>
                    {configStore?.pltCfg?.auth?.registration?.enabled && (
                        <Box
                            sx={{
                                display: "flex",
                                marginTop: "1rem",
                                justifyContent: "end",
                            }}
                        >
                            Don't have an account?
                            <Box
                                onClick={() => navigate("/register")}
                                sx={{
                                    fontStyle: "italic",
                                    ":hover": {
                                        cursor: "pointer",
                                    },
                                }}
                            >
                                Register
                            </Box>
                        </Box>
                    )}
                </Box>
            </Box>
        </>
    );
}
