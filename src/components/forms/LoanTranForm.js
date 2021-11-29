import React, { useState, useEffect, useRef } from 'react'
import Button from '@material-ui/core/Button';
import { LetterFormdata, Apidata } from '../data/data'
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import AddIcon from '@material-ui/icons/Add'
import SearchIcon from '@material-ui/icons/Search';
import { useForm } from "react-hook-form";
import * as yup from 'yup';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import { getToken, getId, getAccounts } from '../utils/Common';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { NotificationContainer, NotificationManager } from 'react-notifications';

const useStyles = makeStyles((theme) => ({
    paper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: "30px",
        marginBottom: "10px"

    },
    root: {
        flexGrow: 1,
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    },
}));

function LoanTranForm(props) {
    const classes = useStyles();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    let accSchema = yup.object().shape({
        tran_amt: yup.string(),
        tran_month: yup.string(),
        tran_comment: yup.string(),
    });

    const { register, handleSubmit, errors } = useForm({
        validationSchema: accSchema
    });

    function onSubmit(data) {
        const apipath = Apidata.api;
        const token = getToken();
        const userId = getId();
        setError(null);
        setLoading(true);
        axios.post(apipath + 'v1/loan_tran', {
            loan: props.accid,
            amount: data.tran_amt,
            month: data.tran_month,
            tranComment: data.tran_comment,
        }, { headers: { "Authorization": `Bearer ${token}` } })
            .then(response => {
                setLoading(false);
                NotificationManager.success('Success, Transaction saved',);
                //console.log(response.data);
                props.onChange();
            }).catch(error => {
                setLoading(false);
                NotificationManager.success('Error, Transaction not saved',);
                
                //if (error.response.status === 401) setError(error.response.data.message);
               // else setError("Something went wrong. Please try again later.");
            });
    }
    return (
        <>
            <NotificationContainer />
            <Paper className={classes.paper} elevation={5}>
                <Typography variant="h6" gutterBottom>
                    {LetterFormdata.loan_payment+' '+props.accid}
                </Typography>
                <form id="create-account" className={classes.form} onSubmit={handleSubmit(onSubmit)}>
                    <Grid container>
                        <Grid item xs={12} sm={3}>
                            <TextField
                                required
                                id="tran_month"
                                name="tran_month"
                                inputRef={register}
                                label={LetterFormdata.month}
                                fullWidth
                            />
                            </Grid>
                            <Grid item xs={12} sm={1}></Grid>
                            <Grid item xs={12} sm={3}>
                                <TextField
                                    required
                                    id="tran_amt"
                                    name="tran_amt"
                                    inputRef={register}
                                    label={LetterFormdata.tran_amt}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} sm={9}>
                                <TextField
                                    required
                                    id="tran_comment"
                                    name="tran_comment"
                                    inputRef={register}
                                    label={LetterFormdata.comment}
                                    fullWidth
                                />
                            </Grid>

                            <Grid container justify="flex-end">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    className={classes.button}
                                    startIcon={<SaveIcon />}
                                    type="submit"
                                >
                                    {LetterFormdata.save}
                                </Button>
                            </Grid>
                        </Grid>
                    
                </form>
            </Paper>
        </>
    )
}

export default LoanTranForm
