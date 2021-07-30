import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthProvider';
import {TextField, Grid, Button, Paper, Card, CardContent, Container, CardMedia, Typography, makeStyles, CardActions} from "@material-ui/core"
import { Link } from 'react-router-dom';

const Login = (props) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    let {login} = useContext(AuthContext);

    const handleLogin = async (e) => {
        try {
            let response = await login(email, password);
            props.history.push("/");
        } catch(err) {
            setEmail("");
            setPassword("");
            setMessage(err.message);
        }
    }

    let useStyles = makeStyles({
        centerDivs: {
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            width: "100vw"
        },
        carousal: {
            height: "10rem",
            backgroundColor: "lightgray"
        },
        fullWidth: {
            width: "100%"
        },
        centerElements: {
            display: "flex",
            flexDirection: "column",

        },
        mb: {
            marginBottom: "2rem"
        },
        alignCenter: {
            justifyContent: "center"
        },
        padding: {
            paddingTop: "1rem",
            paddingBottom: "1rem"
        }
    })

    let classes = useStyles();

    return (
        <div>
            <Container>
                <Grid container spacing={2}>
                    <Grid item sm={5}>
                        <Paper className={classes.carousal}> Carseoul </Paper>
                    </Grid>
                    <Grid item sm={3}>
                        <Card variant="outlined" className={classes.mb}>
                            <CardMedia image="logo.png" style={{height : "5rem"}}></CardMedia>
                            <CardContent className={classes.centerElements}>
                                <TextField label="Email" type="email" variant="outlined" value={email} size="small" onChange={(e) => setEmail(e.target.value)}></TextField>
                                <TextField label="password" type="password" variant="outlined" value={password} size="small" onChange={(e) => setPassword(e.target.value)}></TextField>
                            </CardContent>
                            <CardActions >
                                <Button variant="contained" color="primary" onClick={handleLogin} className={classes.fullWidth}> Login </Button>
                            </CardActions>
                        </Card>
                        <Card variant="outlined" className={classes.padding}>
                            <Typography style={{textAlign: "center"}}>
                                Don"t have an account ? 
                                <Link to="/signup">SIGN-UP</Link>
                            </Typography>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </div>
    )
}
 
export default Login;