import React, {useState} from 'react';

import {baseURL} from '../../../axios';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle'
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    root: {
        '& > *': {
            marginBottom: theme.spacing(3)
        }
    },
    portfolio: {
        marginBottom: '25px',
        position: 'relative'
    },
    portfolioImage: {
        width: '100%',
        height: '225px',
        objectFit: 'cover'
    },
    portfolioTitle: {
        backgroundColor: '#343a40',
        color: '#ffffcf',
        textAlign: 'center',
        minHeight: '50px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '& > p': {
            margin: 0,
            padding: '5px'
        }
    },
    notApproved: {
        opacity: '0.7'
    },
    waitingForApproval: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'rgba(255, 255, 255, 1)',
        textAlign: 'center',
        fontSize: '20px',
        width: '300px',
        maxWidth: '95%'
    }
}))


const Portfolio = (props) => {
    const [open, setOpen] = useState(false);
    const classes = useStyles();

    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }
    return (
        <>
        <div className={classes.portfolio} >
            <div className={!props.approved? classes.notApproved: ''}>
                <button onClick={handleOpen} type='button' style={{border: 'none', background: 'transparent', padding: 0}}>
                    <img className={classes.portfolioImage} src={`${baseURL}/storage/${props.imageUrl}`} alt={props.title}/>

                    <div className={classes.portfolioTitle}>
                        <p>{props.title}</p>
                    </div>
                </button>
            </div>
            {!props.approved &&
                <div className={classes.waitingForApproval}>
                    Laukiama patvirtinimo...
                </div>
            }
        </div>
        <Dialog open={open} onClose={handleClose} fullWidth>                          
            <DialogTitle>{props.title}</DialogTitle>
            <DialogContent className={classes.root} >
                <img style={{width: '100%'}} src={`${baseURL}/storage/${props.imageUrl}`} alt={props.title}/>
                <p>{props.description}  </p>
            </DialogContent>
            <DialogActions>
                <Button color="primary" type='button' onClick={handleClose}>
                    Uždaryti
                </Button>
            </DialogActions>
        </Dialog>
        </>
    )
}

export default Portfolio;