import React, { useState, useEffect } from "react";

import {
    Container, ToggleButtonGroup, ToggleButton as MuiToggleButton, Button,
    ButtonGroup, Divider, Stack, ThemeProvider, createTheme, styled, Link, Typography,
    Accordion, AccordionActions, AccordionSummary as MuiAccordionSummary, AccordionSummaryProps, AccordionDetails
} from "@mui/material";

import Switch from "./components/checkbox";

import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';

import { useNavigate } from "react-router-dom";

import logo from './res/img/logo.png'
  
const ToggleButton = styled(MuiToggleButton)({
    "&.Mui-selected, &.Mui-selected:hover": {
        backgroundColor: '#BD0021'
    },
    "&.MuiToggleButton-standard": {
        color: "white",
    }
});

const AccordionSummary = styled((props: AccordionSummaryProps) => (
    <MuiAccordionSummary
      expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
      {...props}
    />
  ))(({ theme }) => ({
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
      transform: 'rotate(90deg)'
    }
  }));


const theme = createTheme({
    palette: {
        primary: {
            main: '#BD0021',
            contrastText: '#FFFFFF',
        },
        action: {
            active: 'white',
            selected: 'blue'
        }
    },
    components: {
        MuiButtonBase: {
            defaultProps: {
                sx: {
                    maxWidth: '500px',
                    minWidth: '300px',
                    boxShadow: 'none',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }
            }
        },
        MuiButtonGroup: {
            styleOverrides: {
                root: {
                    boxShadow: 'none'
                },
                grouped: {
                    backgroundSize: '100% 100%',
                    maxWidth: '500px',
                    minWidth: '300px',
                    boxShadow: 'none'
                }
            }
        },
        MuiAccordion:{
            defaultProps: {
                elevation: 0,
                sx: {
                    color: "white",
                    background: "none",
                    maxWidth: '40em',
                    padding: '8px 20px 4px 20px',

                }
            }
        },
        MuiAccordionSummary:{
            defaultProps: {
                sx: {
                    flexDirection: 'row-reverse'
                }
            }
        },
        MuiDivider: {
            defaultProps: {
                sx: { color: 'white', border: 0 }
            }
        },
        MuiTypography: {
            defaultProps: {
                sx: { color: 'white', padding: '32px', maxWidth: '40em' }
            }
        },
        MuiLink: {
            defaultProps: {
                sx: { paddingTop: 0, paddingBottom: 0 }
            }
        }
    }
});

const sxAlinga = {
    color: 'black',
    backgroundImage: 'url("tcc_alinga_LGBT.png")',
    fontWeight: 'bold',
    fontSize: '1.0rem',
    // "-webkit-text-stroke": '1px black'
}

function Menu() {

    document.body.style.overflow = 'visible'
    
    // const saved_params = getParams()
    // console.log(saved_params)

    const [dest, setDest] = useState(1);

    const [cyclePages, setCyclePages] = useState(() => {
        const c = localStorage.getItem("cyclePages")
        if (c) return JSON.parse(c) 
        else return true
    })

    useEffect(() => {
        localStorage.setItem("cyclePages", JSON.stringify(cyclePages))
    }, [cyclePages])

    let navigate = useNavigate();

    const handleDestChange = (
        event: React.MouseEvent,
        newState: number
    ) => {
        if (newState) setDest(newState)
    }

    const handleButtonClick = (
        button_val: number
    ) => {
        var navigate_str = `/rail?to=${dest}&at=${button_val}`
        if (cyclePages) navigate_str += `&cycle`
        navigate(navigate_str)
    }

    const handleCyclePagesCheckbox = (
        event: React.ChangeEvent
    ) => {
        event.preventDefault()
        var checked = (event.target as HTMLInputElement).checked
        console.log(checked)
        setCyclePages(checked)
    }   

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth='sm'>
                <Stack
                    spacing={1}
                    className="menu"
                >
                    <br></br>
                    <img id="logo" src={logo} alt="transport information logo" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/0/00/Under_Construction_Line.PNG"/>
                    <Typography variant="body1">I am so so sorry but something weird has happened with the Transport Canberra data. I am on the case but until then wing it I guess?</Typography>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/0/00/Under_Construction_Line.PNG"/>
                    <div className="accordion">
                    <Accordion>
                        <AccordionSummary>
                        <Typography sx={{marginLeft:'5px'}}><u>Instructions</u></Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                        Once you select a travel direction and station you will be redirected to the live display.
                        On the display the current locations of light rail vehicles are displayed with yellow dots.
                        Your stop is marked with a white square, and the end of the line is marked with a red and white square.
                        You can tap the display once to show future arrivals and double tap
                        to go full screen (except for iPhone for some reason?).
                        </AccordionDetails>
                    </Accordion>
                    </div>

                    <Divider>Which direction are you heading?</Divider>
                    <ToggleButtonGroup
                        orientation="vertical"
                        value={dest}
                        exclusive
                        onChange={handleDestChange}
                        aria-label="Towards"
                        sx={{ alignItems: "center" }}
                    >
                        <ToggleButton value={1} aria-label="Alinga Street">Alinga Street
                        </ToggleButton>
                        <ToggleButton value={14} aria-label="Gungahlin Place">Gungahlin Place
                        </ToggleButton>
                    </ToggleButtonGroup>
                    <br></br>

                    <Divider>Which station are you departing from?</Divider>
                    <ButtonGroup
                        orientation="vertical"
                        variant="contained"
                        aria-label="Station"
                        sx={{ alignItems: "center" }}
                    >
                        <Button onClick={() => handleButtonClick(1)} sx={sxAlinga} >Alinga Street</Button>
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
                        I wrote this web app which takes publicly available live data from Transport
                        Canberra and displays it for each of the light rail stops. I have been inspired
                        to make the graphics similar to the ones displayed at the actual stations.
                        It does differ a little from the real world one as I have made my own modifications because... I can! This web app is
                        still under development and may have a few bugs now and again, but it is open source!
                        If you want to know how it works, add some suggestions, report bugs or contact(/hire) me,
                        the link to the GitHub repo is below. </Typography>

                    <Link href="https://github.com/flightmansam/cbr-light-rail-react"><b>Link to source code</b></Link>
                    <Link href="https://github.com/flightmansam"><b>Link to me!</b></Link>
                    <Link href="https://www.buymeacoffee.com/flightmansam"><b>Buy me a coffee!</b></Link>

                    <Typography variant="body1">
                        This app is completely unofficial and is by no means affiliated with Transport Canberra so please don't get up in
                        their grill (unless you want to show off how awesome of a job I have done!). Also there is no analytics or data tracking.
                        Hopefully this doesn't go too viral because this app is only hosted on a server running in my living room.<br></br>
                    </Typography>

                    <div className="accordion">
                    <Accordion>
                        <AccordionSummary>
                        <Typography sx={{marginLeft:'5px'}}><u>Options</u></Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                        If you don't want the info board to cycle between the route progress indicator and the next arrivals page automatically (every 10s), turn this switch below off. Your browser will remember this setting.<br/><br/>
                        Cycle pages automatically: <Switch checked={cyclePages} onChange={handleCyclePagesCheckbox}></Switch>
                        </AccordionDetails>
                    </Accordion>
                    </div>

                    <Typography variant="body1" align="right">
                        Ver. 1.7.1 - 24th June
                    </Typography>
                </Stack>
            </Container>
        </ThemeProvider>
    );


}

export default Menu
