import React, { useState } from "react"; 
import {
  Box,
  Typography,
  Grid2,
  Button,
  Divider,
  Dialog,
  DialogContent,
} from "@mui/material";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation("global");

  const [openContact, setOpenContact] = useState(false);
  const [openAbout, setOpenAbout] = useState(false);

  // Handlers for Contact Us dialog
  const handleContactOpen = () => setOpenContact(true);
  const handleContactClose = () => setOpenContact(false);

  // Handlers for About Us dialog
  const handleAboutOpen = () => setOpenAbout(true);
  const handleAboutClose = () => setOpenAbout(false);

  return (
<Box 
  sx={{ 
    backgroundColor: "#f9f9f9", 
    color: "#333", 
    padding: "0",
    width: "100%",
    bottom: 0,
    left: 0,
    right: 0,
  }}
>
      {/* Main Footer Content */}
      <Box sx={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center", padding: "20px" }}>
        {/* Logo and Tagline */}
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "20px", gap: "10px" }}>
          <img
            src={`${process.env.PUBLIC_URL}/favicon.ico`}
            alt="Fuudiy Logo"
            style={{ width: "50px", height: "50px" }}
          />
          <Typography variant="h4" component="div" sx={{ fontWeight: "bold" }}>
            Fuudiy
          </Typography>
        </Box>

        {/* Statistics Section */}
        <Grid2 container spacing={2} sx={{ marginBottom: "20px", justifyContent: "center", alignContent: "center" }}>
          <Grid2 item xs={6} sm={3}>
            <Typography variant="h6" component="div">
              40.000+
            </Typography>
            <Typography variant="body2">{t('traditionalFoods')}</Typography>
          </Grid2>
          <Grid2 item xs={6} sm={3}>
            <Typography variant="h6" component="div">
              15+
            </Typography>
            <Typography variant="body2">{t('differentCountries')}</Typography>
          </Grid2>
        </Grid2>

        <Divider sx={{ margin: "20px 0" }} />
       
        {/* Buttons */}
        <Typography
          variant="body2"
          component="a"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleContactOpen();
          }}
          sx={{ color: "#333", textDecoration: "none", cursor: "pointer" }}
        >
          {t('contactUs')}
        </Typography>

        <Typography
          variant="body2"
          component="a"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleAboutOpen();
          }}
          sx={{ color: "#333", textDecoration: "none", cursor: "pointer", marginLeft: "20px" }}
        >
          {t('aboutUs')}
        </Typography>
      </Box>
      
      {/* Footer Bottom */}
      <Box sx={{ backgroundColor: "#333", color: "#fff", padding: "10px", textAlign: "center" }}>
        <Typography variant="body2">
          &copy; {new Date().getFullYear()} Fuudiy - {t('rightsReserved')}
        </Typography>
      </Box>

      {/* Contact Information Dialog */}
      <Dialog open={openContact} onClose={handleContactClose}>
        <Box sx={{ textAlign: "right", border: "none" }}>
          <Button 
            onClick={handleContactClose} 
            sx={{ 
              height: "5px", 
              width: "5px", 
              minWidth: "auto", 
              marginRight: "10px", 
              marginTop: "10px", 
              color: "black", 
              fontSize: "1.2rem", 
              lineHeight: "1"
            }}
          > 
            X 
          </Button>
        </Box>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            <strong>Email:</strong> humanGenerated.TOBB@gmail.com
          </Typography>
          <Typography variant="body1" gutterBottom>
            .....
          </Typography>
          <Typography variant="body1" gutterBottom>
            • Su Eda YILDIZ - su.yildiz.030609@gmail.com 
          </Typography>
          <Typography variant="body1" gutterBottom>
            • Nursize TURAN - 1nursizeturan@gmail.com
          </Typography>
          <Typography variant="body1" gutterBottom>
            • Tuba Sultan BALCI - tubalci33@gmail.com
          </Typography>
          <Typography variant="body1" gutterBottom>
            • Berfin OZCUBUK - katanisi15@gmail.com
          </Typography>
          <Typography variant="body1" gutterBottom>
            • Beyza AKDENIZ - hivayede@gmail.com
          </Typography>
          <Typography variant="body1" gutterBottom>
            .....
          </Typography>
        </DialogContent>
      </Dialog>

      {/* About Us Dialog */}
      <Dialog open={openAbout} onClose={handleAboutClose}>
        <DialogContent>
          <Box sx={{ textAlign: "right", border: "none" }}>
            <Button 
              onClick={handleAboutClose} 
              sx={{ 
                height: "5px", 
                width: "5px", 
                minWidth: "auto", 
                padding: "0", 
                marginRight: "10px", 
                marginTop: "10px", 
                color: "black", 
                fontSize: "1.2rem", 
                lineHeight: "1"
              }}
            > 
              X 
            </Button>
          </Box>
          <Typography variant="body1" gutterBottom>
            <strong>-- EN --</strong> <br />
            Hello dear visitor! <br />
            We are a team of passionate senior students in computer science driven by a common vision of using big data to find solutions to the problems that affect the real world. 
            <br />With diverse skills in data science, machine learning, software development, and user experience, we work as a team to create innovative solutions that make data-driven insights accessible and impactful. 
            <br />The current project involves the use of advanced big data technologies to provide intelligent and efficient recommendations, showing our capabilities of combining technical skills with creativity in solving practical challenges.
            
            <br /><br />
            <strong>-- TR --</strong>
            <br />Merhaba değerli ziyaretçi!
            <br />Gerçek dünyayı etkileyen sorunlara çözüm bulmak için büyük veriyi kullanma ortak vizyonuyla hareket eden tutkulu bilgisayar bilimleri son sınıf öğrencilerinden oluşan bir ekibiz. 
            <br />Veri bilimi, makine öğrenimi, yazılım geliştirme ve kullanıcı deneyimi alanlarındaki farklı becerilerimizle, veriye dayalı içgörüleri erişilebilir ve etkili hale getiren yenilikçi çözümler oluşturmak için bir ekip olarak çalışıyoruz. 
            <br />Mevcut proje, akıllı ve verimli öneriler sunmak için gelişmiş büyük veri teknolojilerinin kullanılmasını içeriyor ve pratik zorlukları çözmede teknik becerileri yaratıcılıkla birleştirme yeteneklerimizi gösteriyor.
          </Typography>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Footer;