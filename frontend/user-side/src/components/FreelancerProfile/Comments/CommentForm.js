import React from 'react';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import Rating from '@material-ui/lab/Rating';
import {makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import { useFormik} from 'formik';
import {object as yupObject, string as yupString} from 'yup';
import axios from '../../../axios';

const useStyles = makeStyles(theme => ({
    root: {
        '& > *': {
            marginBottom: theme.spacing(3)
        }
    },
    rating: {
        display: 'flex',
        alignItems: 'center',
        '& > span': {
            marginLeft: '10px'
        }
    },
    ratingLabel: {
        marginBottom: 0
    }
}))

const CommentForm = (props) => {
    const classes = useStyles();

    const toEdit = props.commentToEdit? true: false;

    const formik = useFormik({
        initialValues: {
            rating: toEdit? props.commentToEdit.rating: 3,
            comment: toEdit? props.commentToEdit.comment: ''
        },
        validationSchema: yupObject({
            rating: yupString().min(1).max(5),
        }),
        onSubmit: values => {
            props.setUploading(true);

            if(toEdit) {
                axios.put('comment/' + props.commentToEdit.id, values, {
                    headers: {
                        'Authorization': 'Bearer ' + props.token
                    }
                }).then(res => {
                    props.setUploading(false);

                    if(!res.error) {
                        props.handleClose();
                        const newComments = props.allComments.map(comment => {
                            if(comment.id === props.commentToEdit.id) {
                                comment.rating = values.rating;
                                comment.comment = values.comment;
                            }
                            return comment;
                        })
                        props.setComments(newComments)
                    }
                }).catch(err => {
                    props.setUploading(false);
                    console.log(err);
                })
            } else {
                axios.post('comment', {...values, receiver_id: props.profileUserID}, {
                    headers: {
                        'Authorization': 'Bearer ' + props.token,
                    }
                }).then(res => {
                    props.setUploading(false);

                    if(!res.error && res.status === 200) {
                        props.handleClose();
                        props.setComments([res.data, ...props.allComments])
                    }
                })
                .catch(err => {
                    props.setUploading(false);

                    console.log(err);
                })
            }
            
        }
    })

    return (
        <form onSubmit={formik.handleSubmit}>
            <DialogContent className={classes.root}>
                <h5 className={classes.rating}>
                    Įvertinimas 
                    <Rating 
                        classes={{
                            label: classes.ratingLabel
                        }}
                        value={formik.values.rating}
                        name="rating"
                        onChange={(e,value) => {
                            formik.setFieldValue('rating', value? value: 3)
                        }}
                    />
                </h5>
                <div>
                    <TextField
                        label="Komentaras"
                        variant='outlined'
                        multiline
                        rows={2}
                        fullWidth
                        {...formik.getFieldProps('comment')}
                    />
                </div>
            </DialogContent>
            <DialogActions>
                <Button color="primary" type='button' onClick={props.handleClose}>
                    Atšaukti
                </Button>
                <Button color="primary" type='submit'>
                    Pateikti
                </Button>
            </DialogActions>
        </form>
    )
}

export default CommentForm;