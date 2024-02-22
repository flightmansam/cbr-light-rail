import React, {useState } from "react";
import { ToggleButtonGroup,  ToggleButton as MuiToggleButton, Button, ButtonGroup, Divider, Stack, ThemeProvider, createTheme, styled, Link, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ToggleButton = styled(MuiToggleButton)({
    "&.Mui-selected, &.Mui-selected:hover": {
      backgroundColor: '#BD0021'
    },
    "&.MuiToggleButton-standard": {
        color: "white",
      }
  });

const theme = createTheme({
    palette: {
      primary: {
        main: '#BD0021',
        contrastText: '#FFFFFF',
        
      }
    },
    components: {
        MuiButtonBase:{
            defaultProps:{
                sx:{maxWidth: '500px', 
                minWidth: '300px', 
                boxShadow:'none'}
            }
        },
        MuiButtonGroup:{
            styleOverrides:{
                root:{
                    boxShadow:'none'
                },
                grouped:{
                    maxWidth: '500px', 
                    minWidth:'300px',
                    boxShadow:'none'
                }
            }
        },
        MuiDivider:{
            defaultProps:{
                sx:{color:'white', border:0}
            }
        },
        MuiTypography:{
            defaultProps:{
                sx:{color:'white', padding:4}
            }
        },
        MuiLink:{
            defaultProps:{
                sx:{paddingTop:0, paddingBottom:0}
            }
        }
    }
  });
  
function Menu() {
    const [dest, setDest] = useState(1);
    let navigate = useNavigate();

    const handleDestChange = (
        event: React.MouseEvent,
        newState: number
    ) => 
    {
        if (newState) setDest(newState)   
    }

    const handleButtonClick = (
        button_val: number
    ) => {
        navigate(`/rail?to=${dest}&at=${button_val}`)
    }

    return (
        <ThemeProvider theme={theme}>
        <Stack 
        spacing={1}
        className="menu"
        >    
        <Typography variant="h3">TC Light Rail Info</Typography>

        <Typography variant="body1">
            <b>Instructions</b>:<br></br>
            Once you select a travel direction and station you will be redirected to the live display.
            On the display the current locations of light rail vehicles are displayed with yellow dots.
            Your stop is marked with a white square, and the end of the line is marked with a red and white square. 
            You can tap the display once to show future arrivals and double tap 
            to go full screen (except for iPhone for some reason?).</Typography>
        
        <Divider>Towards</Divider>
        <ToggleButtonGroup
          orientation="vertical"
          value={dest}
          exclusive
          onChange={handleDestChange}
          aria-label="Towards"
          sx={{alignItems:"center"}}
        >
          <ToggleButton value={1} aria-label="Alinga Street">Alinga Street
          </ToggleButton>
          <ToggleButton value={14} aria-label="Gungahlin Place">Gungahlin Place
          </ToggleButton>
        </ToggleButtonGroup>
        <br></br>

        <Divider>Station</Divider>
        <ButtonGroup 
            orientation="vertical"
            variant="contained" 
            aria-label="Station"
            sx={{alignItems:"center"}}
           >
            <Button onClick={() => handleButtonClick(1)} >Alinga Street</Button>
            <Button onClick={() => handleButtonClick(2)} >Elouera Street</Button>
            <Button onClick={() => handleButtonClick(3)} >Ipima Street</Button>
            <Button onClick={() => handleButtonClick(4)} >Macarthur Avenue</Button>
            <Button onClick={() => handleButtonClick(5)} >Dickson</Button>
            <Button onClick={() => handleButtonClick(6)} >Swinden Street</Button>
            <Button onClick={() => handleButtonClick(7)} >Phillip Avenue</Button>
            <Button onClick={() => handleButtonClick(8)} >EPIC and Racecourse</Button>
            <Button onClick={() => handleButtonClick(9)} >Sandford Street</Button>
            <Button onClick={() => handleButtonClick(10)}>Well Station Drive</Button>
            <Button onClick={() => handleButtonClick(11)}>Nullarbor Avenue</Button>
            <Button onClick={() => handleButtonClick(12)}>Mapleton Avenue</Button>
            <Button onClick={() => handleButtonClick(13)}>Manning Clark</Button>
            <Button onClick={() => handleButtonClick(14)}>Gungahlin Place</Button>
        </ButtonGroup>
        <br></br>

        <Typography variant="body1">
            <b>What is this anyway?</b> <br></br>
            I wrote this web app which takes publically available live data from transport 
            canberra and displays it for each of the light rail stops. I have been inspired
            to make the graphics similar to the ones displayed at the actual stations.
            It does differ a little from the real world one as I have made my own modifications because... I can! This web app is 
            still under development and may have a few bugs now and again, but it is open source!
            If you want to know how it works, add some suggestions, report bugs or contact(/hire) me, 
            the link to the GitHub repos are below. </Typography>

        <Link href="https://github.com/flightmansam/cbr-light-rail-react">Link the web app repo</Link>
        <Link href="https://github.com/flightmansam/cbr-light-rail-data">Link to my data API repo</Link>
        <Link href="https://github.com/flightmansam">Link to me!</Link>
        
        <Typography variant="body1">
            This app is completely unoffical and is by no means affiliated with Transort Canberra so please don't get up in 
            their grill (unless you want to show off how awesome of a job I have done!). Also there is no analytics or data tracking. 
            Hopefully this doesn't go too viral because this app is only hosted on a server running in my living room.
        </Typography>

        <Typography variant="body1" align="right">
        Ver. 1.1 - 22nd Feb
        </Typography>
        
        </Stack>
        </ThemeProvider>
      );


}

export default Menu