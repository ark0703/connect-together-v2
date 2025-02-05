import React from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Avatar,
} from "@mui/material";

const HomePage: React.FC = () => {
  return (
    <Box>
      {/* Hero Section */}
      <Box sx={{ bgcolor: "#f9fafb", py: 8, textAlign: "center" }}>
        <Container maxWidth="lg">
          <Typography variant="h3" fontWeight={700} gutterBottom>
            We're changing the way people connect
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            maxWidth={"md"}
            mx="auto"
          >
            Cupidatat minim id magna ipsum sint dolor. Sunt sit in cupidatat
            mollit aute velit. Et labore commodo nulla aliqua.
          </Typography>
        </Container>
      </Box>

      {/* Mission Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Our mission
        </Typography>
        <Typography variant="body1" color="text.secondary" maxWidth={"md"}>
          Aliquet nec orci mattis amet quisque ullamcorper neque, nibh sem. At
          arcu, sit dui mi eget. Quisque id velit eget vitae, elit eget.
        </Typography>
      </Container>

      {/* Values Section */}
      <Box sx={{ bgcolor: "#f9fafb", py: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Our values
          </Typography>
          <Grid container spacing={3}>
            {[
              "Be world-class",
              "Share knowledge",
              "Always learning",
              "Take responsibility",
            ].map((value, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600}>
                      {value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Team Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Our team
        </Typography>
        <Grid container spacing={3}>
          {[...Array(6)].map((_, index) => (
            <Grid item xs={12} sm={4} key={index} textAlign="center">
              <Avatar sx={{ width: 80, height: 80, mx: "auto" }} />
              <Typography variant="h6" fontWeight={600} mt={2}>
                Team Member
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Position
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Blog Section */}
      <Box sx={{ bgcolor: "#f9fafb", py: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight={600} gutterBottom>
            From the blog
          </Typography>
          <Grid container spacing={3}>
            {[...Array(3)].map((_, index) => (
              <Grid item xs={12} sm={4} key={index}>
                <Card>
                  <CardMedia
                    component="img"
                    height="140"
                    image="https://source.unsplash.com/random"
                    alt="Blog post"
                  />
                  <CardContent>
                    <Typography variant="h6" fontWeight={600}>
                      Blog Title
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Short description here...
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 4, textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary">
          © 2024 Your Company, Inc. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default HomePage;
