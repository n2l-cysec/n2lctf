import { useAuthStore } from "@/stores/auth";
import { useConfigStore } from "@/stores/config";
import {
    Text,
    Button,
    Divider,
    Group,
    Paper,
    PasswordInput,
    Stack,
    TextInput,
    Anchor,
    Container,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    showErrNotification,
    showSuccessNotification,
} from "@/utils/notification";
import { login } from "@/api/user";
import { upperFirst } from "@mantine/hooks";

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
                console.error(err.response.data);
                if (err.response.data.code == 400) {
                    showErrNotification({
                        title: "Invalid Login",
                        message: `Wrong uername / email or password`,
                    });
                } else {
                    showErrNotification({
                        title: "An Error Occurred",
                        message: `Login Failed ${err}`,
                    });
                }
            })
            .finally(() => {
                setLoginLoading(false);
            });
    }

    return (
        <Container size={420} my={40}>
            <Paper radius="md" p="xl" withBorder>
                <Text size="lg" fw={500}>
                    Welcome to {configStore?.pltCfg?.site?.title}, please login
                </Text>

                <Divider
                    label="Or continue with email"
                    labelPosition="center"
                    my="lg"
                />

                <form onSubmit={form.onSubmit((_) => handleLogin())}>
                    <Stack>
                        <TextInput
                            required
                            label="Username/Email"
                            placeholder="hello/hello@example.com"
                            radius="md"
                            {...form.getInputProps("account")}
                        />

                        <PasswordInput
                            required
                            label="Password"
                            placeholder="Your password"
                            radius="md"
                            {...form.getInputProps("password")}
                        />
                    </Stack>

                    <Group justify="space-between" mt="xl">
                        <Button
                            type="submit"
                            radius="xl"
                            loading={loginLoading}
                        >
                            Login
                        </Button>
                    </Group>
                    {configStore?.pltCfg?.auth?.registration?.enabled && (
                        <Group justify="space-between" mt="xl">
                            <Anchor
                                component="button"
                                type="button"
                                c="dimmed"
                                onClick={() => navigate("/register")}
                                size="xs"
                            >
                                Don't have an account? Register
                            </Anchor>
                        </Group>
                    )}
                </form>
            </Paper>
        </Container>
    );
}
