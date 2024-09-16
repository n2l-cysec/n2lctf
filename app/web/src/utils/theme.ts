import {
    ActionIcon,
    Avatar,
    Checkbox,
    createTheme,
    LoadingOverlay,
    ThemeIcon,
} from "@mantine/core";

export function useTheme() {
    const theme = createTheme({
        colors: {
            brand: [
                // Gradient from cyan to purple
                "rgba(200, 255, 255, 0.7)", // Very light cyan
                "rgba(170, 230, 255, 0.7)", // Light cyan
                "rgba(140, 205, 255, 0.7)", // Soft cyan
                "rgba(110, 180, 255, 0.7)", // Medium cyan
                "rgba(80, 155, 255, 0.7)",  // Deep cyan
                "rgba(120, 130, 255, 0.7)", // Light purple cyan
                "rgba(140, 110, 255, 0.7)", // Soft purple cyan
                "rgba(160, 90, 255, 0.7)",  // Medium purple cyan
                "rgba(180, 70, 255, 0.7)",  // Deep purple cyan
                "rgba(200, 50, 255, 0.7)"   // Light purple
            ],
            light: [
                "#FFFFFF",
                "#F8F8F8",
                "#EFEFEF",
                "#E0E0E0",
                "#DFDFDF",
                "#D0D0D0",
                "#CFCFCF",
                "#C0C0C0",
                "#BFBFBF",
                "#B0B0B0",
            ],
            dark: [
                "#d5d7d7",
                "#acaeae",
                "#8c8f8f",
                "#666969",
                "#4d4f4f",
                "#343535",
                "#2b2c2c",
                "#1d1e1e",
                "#0c0d0d",
                "#010101",
            ],
            gray: [
                "#EBEBEB",
                "#CFCFCF",
                "#B3B3B3",
                "#969696",
                "#7A7A7A",
                "#5E5E5E",
                "#414141",
                "#252525",
                "#202020",
                "#141414",
            ],
            red: [
                "#FFB4B4",
                "#FFA0A0",
                "#FF8c8c",
                "#FF7878",
                "#FF6464",
                "#FE5050",
                "#FE3c3c",
                "#FE2828",
                "#FC1414",
                "#FC0000",
            ],
        },
        primaryColor: "brand",
        components: {
            LoadingOverlay: LoadingOverlay.extend({
                defaultProps: {
                    transitionProps: {
                        exitDuration: 250,
                    },
                    overlayProps: {
                        backgroundOpacity: 0,
                    },
                },
            }),
            ActionIcon: ActionIcon.extend({
                defaultProps: {
                    variant: "transparent",
                },
            }),
            ThemeIcon: ThemeIcon.extend({
                defaultProps: {
                    variant: "transparent",
                },
            }),
            Avatar: Avatar.extend({
                defaultProps: {
                    imageProps: {
                        draggable: false,
                    },
                },
            }),
            Checkbox: Checkbox.extend({
                styles: {
                    body: {
                        alignItems: "center",
                    },
                    labelWrapper: {
                        display: "flex",
                    },
                },
            }),
        },
    });
    return { theme: theme };
}
