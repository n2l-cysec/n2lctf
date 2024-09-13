import { register } from "@/api/user";
import MDIcon from "@/components/ui/MDIcon";
import { useConfigStore } from "@/stores/config";
import { Box, Button, Flex, Group, Stack, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useEffect, useState } from "react";
import { redirect } from "react-router-dom";
import {
    showErrNotification,
    showSuccessNotification,
} from "@/utils/notification";
import Turnstile from "react-turnstile";
import ReCAPTCHA from "react-google-recaptcha";
import { z } from "zod";

export default function Page() {
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
            !form.getValues().token
        ) {
            showErrNotification({
                title: "Registration Failed",
                message: "Please complete the CAPTCHA verification",
            });
            return;
        }
        setRegisterLoading(true);
        register({
            username: form.getValues().username?.toLocaleLowerCase(),
            nickname: form.getValues().nickname,
            password: form.getValues().password,
            email: form.getValues().email,
            token: form.getValues().token,
        })
            .then((_) => {
                showSuccessNotification({
                    title: "Registration Successful",
                    message: "Please log in",
                });
                redirect("/login");
            })
            .catch((err) => {
                switch (err.response?.status) {
                    case 400:
                        showErrNotification({
                            title: "Registration Failed",
                            message: "Username or email is already registered",
                        });
                        break;
                }
            })
            .finally(() => {
                setRegisterLoading(false);
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
                <Stack>
                    <form onSubmit={form.onSubmit((_) => handleRegister())}>
                        <Stack>
                            <Group>
                                <TextInput
                                    label="Username"
                                    size="lg"
                                    leftSection={<MDIcon>person</MDIcon>}
                                    key={form.key("username")}
                                    {...form.getInputProps("username")}
                                />
                                <TextInput
                                    label="Nickname"
                                    size="lg"
                                    leftSection={<MDIcon>person</MDIcon>}
                                    key={form.key("nickname")}
                                    {...form.getInputProps("nickname")}
                                />
                            </Group>
                            <TextInput
                                label="Email"
                                size="lg"
                                leftSection={<MDIcon>email</MDIcon>}
                                key={form.key("email")}
                                {...form.getInputProps("email")}
                            />
                            <TextInput
                                label="Password"
                                type="password"
                                size="lg"
                                leftSection={<MDIcon>lock</MDIcon>}
                                key={form.key("password")}
                                {...form.getInputProps("password")}
                            />
                            <Flex justify={"center"}>
                                {configStore?.pltCfg?.auth?.registration
                                    ?.captcha && (
                                    <>
                                        {configStore?.pltCfg?.captcha
                                            ?.provider === "turnstile" && (
                                            <Turnstile
                                                sitekey={String(
                                                    configStore?.pltCfg?.captcha
                                                        ?.turnstile?.site_key
                                                )}
                                                onVerify={(token) => {
                                                    form.setValues({
                                                        ...form.values,
                                                        token: token,
                                                    });
                                                }}
                                            />
                                        )}
                                        {configStore?.pltCfg?.captcha
                                            ?.provider === "recaptcha" && (
                                            <ReCAPTCHA
                                                sitekey={String(
                                                    configStore?.pltCfg?.captcha
                                                        ?.recaptcha?.site_key
                                                )}
                                                onChange={(token) => {
                                                    form.setValues({
                                                        ...form.values,
                                                        token: String(token),
                                                    });
                                                }}
                                            />
                                        )}
                                    </>
                                )}
                            </Flex>
                            <Button
                                loading={registerLoading}
                                size={"lg"}
                                fullWidth
                                sx={{ bgcolor: "primary.700" }}
                                type="submit"
                            >
                                Register
                            </Button>
                        </Stack>
                    </form>
                    <Box
                        sx={{
                            display: "flex",
                            marginTop: "1rem",
                            justifyContent: "end",
                        }}
                    >
                        Already have an account?
                        <Box
                            onClick={() => redirect("/login")}
                            sx={{
                                fontStyle: "italic",
                                ":hover": {
                                    cursor: "pointer",
                                },
                            }}
                        >
                            Log in
                        </Box>
                    </Box>
                </Stack>
            </Box>
        </>
    );
}
