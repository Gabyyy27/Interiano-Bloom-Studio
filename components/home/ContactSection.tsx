"use client";

import type {
    ChangeEvent,
    FormEvent,
    ReactNode,
} from "react";

import { useState } from "react";

import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import InstagramIcon from "@mui/icons-material/Instagram";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import FacebookIcon from "@mui/icons-material/Facebook";
import {
    Box,
    Button,
    Fab,
    MenuItem,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import SectionContainer from "@/components/common/SectionContainer";

const WHATSAPP_NUMBER = "50433219649";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

const FACEBOOK_URL =
    "https://www.facebook.com/profile.php?id=61574277849076";

const fieldStyles = {
    "& .MuiOutlinedInput-root": {
        minHeight: 56,
        borderRadius: 3,
        backgroundColor: "rgba(255, 255, 255, 0.82)",

        "& fieldset": {
            borderColor: "rgba(125, 79, 80, 0.18)",
        },

        "&:hover fieldset": {
            borderColor: "rgba(125, 79, 80, 0.42)",
        },

        "&.Mui-focused fieldset": {
            borderColor: "primary.main",
            borderWidth: 1,
        },
    },

    "& .MuiInputBase-input": {
        px: 2.5,
        py: 1.8,
    },

    "& .MuiInputBase-input::placeholder": {
        color: "text.secondary",
        opacity: 0.72,
    },
};

const fieldLabelStyles = {
    display: "block",
    mb: 1,
    color: "text.secondary",
    fontSize: "0.76rem",
    fontWeight: 600,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
};

interface InfoCardProps {
    icon: ReactNode;
    label: string;
    value: string;
    href?: string;
}

function InfoCard({
    icon,
    label,
    value,
    href,
}: InfoCardProps) {
    const content = (
        <Stack
            direction="row"
            spacing={2.5}
            sx={{
                alignItems: "center",
            }}
        >
            <Box
                sx={{
                    width: 56,
                    height: 56,
                    flexShrink: 0,
                    display: "grid",
                    placeItems: "center",
                    borderRadius: 2.5,
                    color: "common.white",
                    background:
                        "linear-gradient(145deg, #E4C58A 0%, #B07A35 100%)",
                    boxShadow: "0 10px 24px rgba(176, 122, 53, 0.18)",
                }}
            >
                {icon}
            </Box>

            <Box>
                <Typography
                    component="p"
                    variant="body2"
                    sx={{
                        mb: 0.25,
                        color: "text.secondary",
                        fontSize: "0.73rem",
                        fontWeight: 600,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                    }}
                >
                    {label}
                </Typography>

                <Typography
                    component="p"
                    sx={{
                        color: "text.primary",
                        fontSize: {
                            xs: "0.98rem",
                            sm: "1.08rem",
                        },
                        fontWeight: 600,
                        lineHeight: 1.35,
                    }}
                >
                    {value}
                </Typography>
            </Box>
        </Stack>
    );

    const cardStyles = {
        display: "block",
        minHeight: 98,
        p: {
            xs: 2.25,
            sm: 2.75,
        },
        border: "1px solid",
        borderColor: "rgba(125, 79, 80, 0.16)",
        borderRadius: 3.5,
        color: "inherit",
        textDecoration: "none",
        backgroundColor: "rgba(255, 255, 255, 0.72)",
        boxShadow: "0 12px 30px rgba(43, 43, 43, 0.035)",
        transition:
            "transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease",

        "&:hover": {
            transform: "translateY(-2px)",
            borderColor: "rgba(176, 122, 53, 0.42)",
            boxShadow: "0 16px 34px rgba(43, 43, 43, 0.07)",
        },
    };

    if (href) {
        return (
            <Box
                component="a"
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                sx={cardStyles}
            >
                {content}
            </Box>
        );
    }

    return <Box sx={cardStyles}>{content}</Box>;
}

export default function ContactSection() {
    const [name, setName] = useState("");
    const [occasion, setOccasion] = useState("Cumpleaños");
    const [idea, setIdea] = useState("");

    const handleNameChange = (
        event: ChangeEvent<HTMLInputElement>,
    ) => {
        const sanitizedName = event.target.value
            .replace(/[^\p{L} ]/gu, "")
            .replace(/ {2,}/g, " ")
            .replace(/^ +/, "");

        setName(sanitizedName);
    };
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const message = [
            "Hola Interiano Bloom Studio, deseo cotizar un detalle",
            "",
            `Nombre: ${name}`,
            `Ocasión: ${occasion}`,
            `Idea: ${idea}`,
        ].join("\n");

        const url = `${WHATSAPP_URL}?text=${encodeURIComponent(message)}`;

        window.open(url, "_blank", "noopener,noreferrer");
    };

    return (
        <Box
            sx={{
                background:
                    "linear-gradient(135deg, #FBF7F0 0%, #F7F0E6 50%, #FBF8F3 100%)",
            }}
        >
            <SectionContainer id="contacto">
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            md: "minmax(0, 1fr) minmax(380px, 0.96fr)",
                        },
                        gap: {
                            xs: 7,
                            md: 8,
                            lg: 10,
                        },
                        alignItems: "start",
                    }}
                >
                    <Stack spacing={5}>
                        <Stack spacing={2}>
                            <Typography
                                component="p"
                                variant="body2"
                                sx={{
                                    color: "secondary.dark",
                                    fontWeight: 700,
                                    letterSpacing: "0.3em",
                                    textTransform: "uppercase",
                                }}
                            >
                                Contacto
                            </Typography>

                            <Typography
                                component="h2"
                                sx={{
                                    color: "#201A17",
                                    fontFamily: "var(--font-display), Georgia, serif",
                                    fontSize: {
                                        xs: "2.75rem",
                                        sm: "3.5rem",
                                        md: "4rem",
                                    },
                                    fontWeight: 500,
                                    lineHeight: {
                                        xs: 0.98,
                                        sm: 1.05,
                                    },
                                    letterSpacing: "-0.025em",
                                }}
                            >
                                Hagamos algo{" "}
                                <Box
                                    component="span"
                                    sx={{
                                        display: {
                                            xs: "block",
                                            sm: "inline",
                                        },
                                        color: "#D0A665",
                                        fontFamily: "var(--font-script), cursive",
                                        fontSize: "0.95em",
                                        fontWeight: 500,
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    inolvidable
                                </Box>
                            </Typography>

                            <Typography
                                sx={{
                                    maxWidth: 620,
                                    color: "text.secondary",
                                    fontSize: {
                                        xs: "1rem",
                                        sm: "1.15rem",
                                    },
                                    lineHeight: 1.65,
                                }}
                            >
                                Cuéntanos sobre tu ocasión y te enviaremos opciones a la medida.
                                Respondemos rápido por WhatsApp.
                            </Typography>
                        </Stack>

                        <Stack spacing={2.5}>
                            <InfoCard
                                icon={<WhatsAppIcon />}
                                label="WhatsApp"
                                value="+504 3321-9649"
                                href={WHATSAPP_URL}
                            />

                            <InfoCard
                                icon={<InstagramIcon />}
                                label="Instagram"
                                value="@interiano_bloom_studio"
                                href="https://www.instagram.com/interiano_bloom_studio/"
                            />

                            <InfoCard
                                icon={<FacebookIcon />}
                                label="Facebook"
                                value="Interiano Bloom Studio"
                                href={FACEBOOK_URL}
                            />

                            <InfoCard
                                icon={<LocationOnOutlinedIcon />}
                                label="Ubicación"
                                value="San Pedro Sula, Honduras"
                                href="https://www.google.com/maps/search/?api=1&query=San%20Pedro%20Sula%2C%20Honduras"
                            />

                        </Stack>
                    </Stack>

                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{
                            position: "relative",
                            overflow: "hidden",
                            p: {
                                xs: 3,
                                sm: 4,
                                md: 5,
                            },
                            border: "1px solid",
                            borderColor: "rgba(125, 79, 80, 0.16)",
                            borderRadius: {
                                xs: 4,
                                md: 5,
                            },
                            background:
                                "radial-gradient(circle at 95% 5%, rgba(212, 163, 115, 0.15), transparent 34%), rgba(255, 255, 255, 0.52)",
                            boxShadow: "0 24px 60px rgba(43, 43, 43, 0.09)",
                        }}
                    >
                        <Stack spacing={3}>
                            <Stack spacing={0.75}>
                                <Typography
                                    component="h3"
                                    sx={{
                                        color: "#201A17",
                                        fontFamily: "var(--font-display), Georgia, serif",
                                        fontSize: {
                                            xs: "2rem",
                                            sm: "2.35rem",
                                        },
                                        fontWeight: 500,
                                        lineHeight: 1.1,
                                    }}
                                >
                                    Cotiza tu detalle
                                </Typography>

                                <Typography
                                    sx={{
                                        color: "text.secondary",
                                        lineHeight: 1.6,
                                    }}
                                >
                                    Te contactaremos por WhatsApp al enviar.
                                </Typography>
                            </Stack>

                            <Box>
                                <Box
                                    component="label"
                                    htmlFor="contact-name"
                                    sx={fieldLabelStyles}
                                >
                                    Nombre
                                </Box>

                                <TextField
                                    id="contact-name"
                                    name="name"
                                    value={name}
                                    onChange={handleNameChange}
                                    placeholder="Tu nombre"
                                    autoComplete="name"
                                    required
                                    fullWidth
                                    slotProps={{
                                        htmlInput: {
                                            pattern: "[\\p{L} ]+",
                                            title: "El nombre solo puede contener letras y espacios.",
                                            maxLength: 80,
                                        },
                                    }}
                                    sx={fieldStyles}
                                />
                            </Box>

                            <Box>
                                <Box
                                    component="label"
                                    htmlFor="contact-occasion"
                                    sx={fieldLabelStyles}
                                >
                                    Ocasión
                                </Box>

                                <TextField
                                    id="contact-occasion"
                                    name="occasion"
                                    value={occasion}
                                    onChange={(event) => setOccasion(event.target.value)}
                                    select
                                    required
                                    fullWidth
                                    sx={fieldStyles}
                                >
                                    <MenuItem value="Cumpleaños">Cumpleaños</MenuItem>
                                    <MenuItem value="Aniversario">Aniversario</MenuItem>
                                    <MenuItem value="Boda">Boda</MenuItem>
                                    <MenuItem value="Graduación">Graduación</MenuItem>
                                    <MenuItem value="Detalle especial">
                                        Detalle especial
                                    </MenuItem>
                                    <MenuItem value="Otra ocasión">Otra ocasión</MenuItem>
                                </TextField>
                            </Box>

                            <Box>
                                <Box
                                    component="label"
                                    htmlFor="contact-idea"
                                    sx={fieldLabelStyles}
                                >
                                    Cuéntanos tu idea
                                </Box>

                                <TextField
                                    id="contact-idea"
                                    name="idea"
                                    value={idea}
                                    onChange={(event) => setIdea(event.target.value)}
                                    placeholder="Colores, presupuesto, fecha de entrega..."
                                    multiline
                                    minRows={4}
                                    required
                                    fullWidth
                                    sx={{
                                        ...fieldStyles,

                                        "& .MuiOutlinedInput-root": {
                                            ...fieldStyles["& .MuiOutlinedInput-root"],
                                            alignItems: "flex-start",
                                        },
                                    }}
                                />
                            </Box>

                            <Button
                                type="submit"
                                variant="contained"
                                startIcon={<WhatsAppIcon />}
                                fullWidth
                                sx={{
                                    minHeight: 60,
                                    mt: 1,
                                    borderRadius: 999,
                                    color: "primary.contrastText",
                                    backgroundColor: "primary.main",
                                    boxShadow: "0 14px 30px rgba(73, 53, 36, 0.20)",

                                    "&:hover": {
                                        backgroundColor: "primary.dark",
                                        boxShadow: "0 18px 36px rgba(73, 53, 36, 0.26)",
                                        transform: "none",
                                    },
                                }}
                            >
                                Enviar por WhatsApp
                            </Button>
                        </Stack>
                    </Box>
                </Box>
            </SectionContainer>

            <Fab
                className="floating-whatsapp-button"
                component="a"
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Abrir conversación de WhatsApp"
                sx={{
                    position: "fixed",
                    right: {
                        xs: 18,
                        md: 28,
                    },
                    bottom: {
                        xs: 18,
                        md: 28,
                    },
                    zIndex: (theme) => theme.zIndex.tooltip,
                    width: 62,
                    height: 62,

                    color: "primary.dark",
                    backgroundColor: "secondary.light",
                    border: "none",
                    boxShadow: "0 12px 28px rgba(135, 102, 59, 0.34)",

                    "&:hover": {
                        color: "common.white",
                        backgroundColor: "secondary.dark",
                    },
                }}
            >
                <WhatsAppIcon fontSize="large" />
            </Fab>
        </Box>
    );
}