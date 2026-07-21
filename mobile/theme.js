// Design tokens — shared across all screens.
// Palette: deep ink navy (authority, focus) + warm amber (the "you got it" signal).
// Kept deliberately restrained: one accent color, flat surfaces, no shadows/gradients.

export const colors = {
  ink: "#101828",        // primary text / headings
  inkSoft: "#475467",    // secondary text
  muted: "#98A2B3",      // placeholders, captions
  paper: "#F9FAFB",      // page background
  surface: "#FFFFFF",    // cards
  border: "#E4E7EC",
  borderStrong: "#D0D5DD",

  navy: "#14213D",       // primary actions, selected state
  navySoft: "#EEF1F6",   // light navy tint (unselected chip bg)

  amber: "#F5A623",      // accent — progress, scores, highlights
  amberSoft: "#FEF3E2",
  amberDeep: "#8A5A0A",  // text-on-amber

  success: "#12B76A",
  successSoft: "#ECFDF3",
  danger: "#F04438",
  dangerSoft: "#FEF3F2",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  xxxl: 36,
};

export const radius = {
  sm: 6,
  md: 10,
  lg: 14,
  pill: 999,
};

export const type = {
  eyebrow: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.2,
    color: colors.amberDeep,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.ink,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.inkSoft,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.6,
    color: colors.inkSoft,
    textTransform: "uppercase",
  },
  body: {
    fontSize: 15,
    fontWeight: "400",
    color: colors.ink,
    lineHeight: 22,
  },
};
