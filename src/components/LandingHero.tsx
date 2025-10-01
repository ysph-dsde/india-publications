import Box from "@mui/material/Box";
import landingBackground from "../assets/images/landingBackground.webp";
import ysphLogo from "../assets/images/ysphLogoWhite.svg";
import { theme } from "../Theme";
import Typography from "@mui/material/Typography";

export const LandingHero = () => {
  return (
    <Box sx={{ position: "relative", height: "100vh", width: "100%" }}>
      {/* Background image */}
      <Box
        sx={{
          height: "100%",
          width: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 0,
          backgroundImage: `url(${landingBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          willChange: "transform",
        }}
      />
      {/* Background overlay */}
      <Box
        sx={{
          height: "100%",
          width: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 1,
          backgroundColor: theme.palette.primary.main,
          opacity: 0.85,
        }}
      />
      {/* Content */}
      <Box
        sx={{
          height: "100%",
          width: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          color: "white",
        }}
      >
        <Box
          component="img"
          src={ysphLogo}
          alt="YSPH DSDE logo"
          width="90%"
        />
        <Typography variant="h3">
          Characterizing the Distribution of Publications in India
        </Typography>
      </Box>
    </Box>
  );
};
