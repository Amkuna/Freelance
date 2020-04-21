import React, {useState, useEffect} from 'react';
import Rating from '@material-ui/lab/Rating';
import axios from '../../../axios';
import SendMessage from './SendMessage/SendMessage';

import IconButton from '@material-ui/core/IconButton';
import {makeStyles} from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';

import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import EditIcon from '@material-ui/icons/Edit'

import Portfolio from './Portfolio/Portfolio';
import ServiceModalButton from './ServiceModalButton';
import SkillModalButton from './SkillModalButton';
import PortfolioModalButton from './PortfolioModalButton';
import PhotoModalButton from './PhotoModalButton';
import ConfirmDeleteModal from './ConfirmDeleteModal';

import Grid from '@material-ui/core/Grid';
import { useAuth } from '../../../context/auth';

const useStyles = makeStyles(theme => ({
    root: {
        padding: '30px',
        backgroundColor: '#eee',
    },
    profileImage: {
        width: '300px',
        margin: '0 auto',
        // height: '300px',
        '& > img': {
            width: '100%',
            height: '100%',
            // borderRadius: '50%',
            objectFit: 'cover'
        },
    },
    imageAddIcon: {
        position: 'relative',
        top: '-80px',
        left: '250px',
    },
    userInfoArea: {
        order: 2,
        [theme.breakpoints.up('md')]: {
            order: 1
        }
    },
    photoArea: {
        order: 1,
        [theme.breakpoints.up('md')]: {
            order: 2
        }
    },
    service: {
        marginBottom: '25px',
        border: '1px solid black',
        padding:'15px', 
        boxShadow: '19px 25px 21px -14px rgba(0,0,0,0.63)',
        position: 'relative'
    },
    removeIcon: {
        colorPrimary: {
            color: 'red',
            backgroundColor: 'red'
        }
    },
    red: {
        color: 'red'
    },
    green: {
        color: '#24fc03'
    }
}));

const DEFAULT_PHOTO = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Roundel_of_None.svg/600px-Roundel_of_None.svg.png';
const PORTFOLIO_TYPES = {
    SERVICE: {
        name: "SERVICE",
        deleteLink: '/delete/service&id='
    },
    SKILL: {
        name: "SKILL",
        deleteLink: '/delete/'
    },
    WORK: {
        name: "WORK",
        deleteLink: '/delete/work&id='
    }
}

const FreelancerProfile = () => {
    let { authTokens } = useAuth();

    const [userInfo, setUserInfo] = useState({
        name: '',
        email: '',
        photo: DEFAULT_PHOTO,
        location: '',
        role: '',
    });

    const [services, setServices] = useState([]);
    const [skills, setSkills] = useState([]);
    const [works, setWorks] = useState([]);

    const [allSkills, setAllSkills] = useState([]);

    const [deleteModalInfo, setDeleteModalInfo] = useState({
        open: false,
        deleteLink: '',
        id: 0
    });

    const classes = useStyles();

    useEffect(() => {
        axios.get('/user/' + authTokens.userID)
            .then(res => {
                console.log("Userio duomenys: ", res);
                const info = res.data.info;
                const portfolio = res.data.portfolio;
                setUserInfo({
                    name: info.name, 
                    location: info.location, 
                    photo: info.foto? info.foto: DEFAULT_PHOTO
                });

                setWorks(portfolio.works);
                setSkills(portfolio.skills);
                setServices(portfolio.services);
                
            })

        axios.get('/skills')
            .then(res => {
                console.log("Skills: ", res);
                setAllSkills(res.data);
            })
    }, [])

    const openModal = (id, type) => {
        let deleteLink = '';
        let portfolioRef = {
            portfolio: undefined,
            setPortfolio: undefined
        }

        switch(type) {
            case PORTFOLIO_TYPES.SERVICE.name:
                deleteLink = PORTFOLIO_TYPES.SERVICE.deleteLink;
                portfolioRef.portfolio = services;
                portfolioRef.setPortfolio = setServices;
                break;
            case PORTFOLIO_TYPES.SKILL.name:
                deleteLink = PORTFOLIO_TYPES.SKILL.deleteLink;
                portfolioRef.portfolio = skills;
                portfolioRef.setPortfolio = setSkills;
                break;
            case PORTFOLIO_TYPES.WORK.name:
                deleteLink = PORTFOLIO_TYPES.WORK.deleteLink;
                portfolioRef.portfolio = works;
                portfolioRef.setPortfolio = setWorks;
                break;
            default:
                break;
        }

        if(deleteLink) {
            setDeleteModalInfo({open: true, deleteLink, id, portfolioRef});
        }
        
    };

    return (
        <div className={classes.root}>
            <Grid container spacing={5}>
                <Grid className={classes.userInfoArea} item xs={12} sm={8}>              
                    <h2>{userInfo.name} <Rating name='read-only' precision={0.25} value={4.5} readOnly /> </h2>
                    <SendMessage recipient={userInfo.name} id={0}/>
                    <div>
                        <h4>
                            Siūlomos paslaugos:
                            <ServiceModalButton services={services} setServices={setServices} token={authTokens.token}/>             
                        </h4>
                        <ul style={{listStyle: 'none', paddingLeft: '20px'}}>
                            {services.map(service => (
                                <li key={service.id} className={classes.service}>
                                    <h5>{service.service}</h5>
                                    <p>{service.description}</p>
                                    <p>Užmokestis: <strong>{service.price_per_hour} €/h</strong></p>

                                    <IconButton style={{position: 'absolute', right: '0', top: '0'}} onClick={() => openModal(service.id, PORTFOLIO_TYPES.SERVICE.name)}>
                                        <RemoveCircleIcon classes={{colorPrimary: classes.red}} color='primary' />
                                    </IconButton>
                                    <IconButton style={{position: 'absolute', right: '40px', top: '0'}}>
                                        <EditIcon color='primary' />
                                    </IconButton>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4
                            >Gebėjimai:
                            <SkillModalButton token={authTokens.token} allSkills={allSkills} skills={skills} setSkills={setSkills} />
                        </h4>
                        <ul style={{listStyle: 'none'}}>
                            {/* {skills.map(skill => (
                                <li key={skill.id}>SERVISAS</li>
                            ))} */}
                        </ul>
                    </div>
                    
                </Grid>
                <Grid className={classes.photoArea} item xs={12} md={4}>
                    <div className={classes.profileImage}>
                        <img src={userInfo.photo === DEFAULT_PHOTO? userInfo.photo: 'http://localhost/storage/' + userInfo.photo} alt="#" />
                        <PhotoModalButton 
                            className={classes.imageAddIcon}
                            userInfo={userInfo} 
                            setUserInfo={setUserInfo}
                            token={authTokens.token} />
                    </div>
                </Grid>
            </Grid>
            <Grid container >
                <Grid item xs={12}>
                    <h2>
                        Portfolio
                        <PortfolioModalButton token={authTokens.token} works={works} setWorks={setWorks} />
                    </h2>
                </Grid>
                {works.map(work => (
                    <Grid key={work.id} item xs={12} md={6} lg={4}>
                        <Portfolio title={work.title} imageUrl={work.filePath} />
                    </Grid>
                ))}
            </Grid>
            <ConfirmDeleteModal token={authTokens.token} modalInfo={deleteModalInfo} setModalInfo={setDeleteModalInfo} />
        </div>
    )
}

export default FreelancerProfile;

// () => {
//     axios.delete('/delete/service&id=' + service.id, {
//         headers: {
//             'Authorization': 'Bearer ' + authTokens.token
//         }
//     })
//         .then(res => {
//             if(!res.error && res.status === 200) {
//                 setServices([...services.filter(serv => serv.id !== service.id)])
//             }
//             console.log(res);
//         })
// }