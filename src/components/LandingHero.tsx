import { Box, Typography } from "@mui/material";
import landingBackground from "../assets/images/landingBackground.jpeg";
import ysphLogo from "../assets/images/ysphLogoWhite.svg";
import { theme } from "../Theme";

export const LandingHero = () => {
  return (
    <Box sx={{ position: "relative", height: "100vh", width: "100%" }}>
      <Box
        sx={{
          backgroundColor: theme.palette.primary.main,
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.85,
          height: "100%",
          width: "100%",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          justifyContent: "center",
          alignItems: "center",
          color: "white",
        }}
      >
        <Box
          component="img"
          src={ysphLogo}
          alt="YSPH DSDE logo"
          width="90%"
        />
        <Typography variant="h5">
          Characterizing the Distribution of Publications in India
        </Typography>
      </Box>
      <Box
        component="img"
        src={landingBackground}
        sx={{
          height: "100%",
          width: "100%",
          objectFit: "cover",
        }}
        // sx={{
        //   height: "100vh", // Full viewport height
        //   backgroundImage: `url(${landingBackground})`,
        //   backgroundSize: "cover",
        //   backgroundPosition: "center",
        //   backgroundRepeat: "no-repeat",
        // }}
      />
    </Box>
  );
};
