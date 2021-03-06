import React from 'react';

import Autocomplete from '@material-ui/lab/Autocomplete';

import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
option: {
    fontSize: 15,
    '& > span': {
    marginRight: 10,
    fontSize: 18,
    },
},
});

const AutoComplete = (props) => {
    const classes = useStyles();
    return (
        <Autocomplete
            style={{ width: props.width || 300 }}
            options={props.options}
            classes={{
                option: classes.option,
            }}

            value={props.value || null}
            onChange={props.onChange}

            inputValue={props.inputValue}
            onInputChange={props.onInputchange}

            autoSelect
            autoHighlight
            getOptionLabel={(option) => option}
            renderOption={(option) => option}
            renderInput={(params) => (
                <TextField
                {...params}
                label={props.label}
                name={props.name}
                variant="outlined"
                inputProps={{
                    ...params.inputProps,
                    autoComplete: 'off',
                }}          
                />
            )}
        />
    )
};

export default AutoComplete;


