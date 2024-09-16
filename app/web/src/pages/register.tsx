import { register } from "@/api/user";
import { useConfigStore } from "@/stores/config";
import {
    Box,
    Button,
    Container,
    Divider,
    Group,
    Paper,
    Stack,
    Text,
    TextInput,
    PasswordInput,
    Flex,
    Anchor
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    showErrNotification,
    showSuccessNotification,
} from "@/utils/notification";
import Turnstile from "react-turnstile";
import ReCAPTCHA from "react-google-recaptcha";
import { z } from "zod";

export default function RegisterPage() {
    const navigate = useNavigate();
    const configStore = useConfigStore();

    useEffect(() => {
        document.title = `Register - ${configStore?.pltCfg?.site?.title}`;
    }, []);

    const [registerLoading, setRegisterLoading] = useState(false);

    const form = useForm({
        mode: "controlled",
        initialValues: {
            username: "",
            nickname: "",
            password: "",
            email: "",
            token: "",
        },

        validate: zodResolver(
            z.object({
                username: z.string().regex(/^[a-z0-9_]{4,16}$/, {
                    message:
                        "Username can only contain lowercase letters, numbers, and underscores, and must be 4-16 characters long",
                }),
                nickname: z.string().min(1, { message: "Nickname cannot be empty" }),
                email: z.string().email({ message: "Invalid email format" }),
                password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
            })
        ),
    });

    function handleRegister() {
        if (
            configStore?.pltCfg?.auth?.registration?.captcha &&
            !form.values.token
        ) {
            showErrNotification({
                title: "Registration Failed",
                message: "Please complete the CAPTCHA verification",
            });
            return;
        }
        setRegisterLoading(true);
        register({
            username: form.values.username?.toLowerCase(),
            nickname: form.values.nickname,
            password: form.values.password,
            email: form.values.email,
            token: form.values.token,
        })
            .then((_) => {
                showSuccessNotification({
                    title: "Registration Successful",
                    message: "Please log in",
                });
                navigate("/login");
            })
            .catch((err) => {
                switch (err.response?.status) {
                    case 400:
                        showErrNotification({
                            title: "Registration Failed",
                            message: "Username or email is already registered",
                        });
                        break;
                    default:
                        showErrNotification({
                            title: "Registration Failed",
                            message: `An error occurred: ${err}`,
                        });
                        break;
                }
            })
            .finally(() => {
                setRegisterLoading(false);
            });
    }

    return (
        <Container size={420} my={40}>
            <Paper radius="md" p="xl" withBorder>
                <Text size="lg" fw={500}>
                    Register for {configStore?.pltCfg?.site?.title}
                </Text>

                <Divider
                    label="Or continue with your details"
                    labelPosition="center"
                    my="lg"
                />

                <form onSubmit={form.onSubmit((_) => handleRegister())}>
                    <Stack>
                        <TextInput
                            label="Username"
                            placeholder="Your username"
                            radius="md"
                            {...form.getInputProps("username")}
                        />
                        <TextInput
                            label="Nickname"
                            placeholder="Your nickname"
                            radius="md"
                            {...form.getInputProps("nickname")}
                        />
                        <TextInput
                            label="Email"
                            placeholder="hello@example.com"
                            radius="md"
                            {...form.getInputProps("email")}
                        />
                        <PasswordInput
                            label="Password"
                            placeholder="Your password"
                            radius="md"
                            {...form.getInputProps("password")}
                        />
                        {configStore?.pltCfg?.auth?.registration?.captcha && (
                            <Flex justify="center">
                                {configStore?.pltCfg?.captcha?.provider === "turnstile" && (
                                    <Turnstile
                                        sitekey={String(configStore?.pltCfg?.captcha?.turnstile?.site_key)}
                                        onVerify={(token) => {
                                            form.setFieldValue("token", token);
                                        }}
                                    />
                                )}
                                {configStore?.pltCfg?.captcha?.provider === "recaptcha" && (
                                    <ReCAPTCHA
                                        sitekey={String(configStore?.pltCfg?.captcha?.recaptcha?.site_key)}
                                        onChange={(token) => {
                                            form.setFieldValue("token", String(token));
                                        }}
                                    />
                                )}
                            </Flex>
                        )}
                        <Button
                            type="submit"
                            radius="xl"
                            loading={registerLoading}
                            fullWidth
                        >
                            Register
                        </Button>
                    </Stack>
                </form>
                <Group justify="space-between" mt="xl">
                    <Anchor
                        component="button"
                        type="button"
                        c="dimmed"
                        onClick={() => navigate("/login")}
                        size="xs"
                    >
                        Already have an account? Login
                    </Anchor>
                </Group>
            </Paper>
        </Container>
    );
}
