import React, { Component } from 'react';
import './Users.css';
import axios from '../../axios';
import UserDeleteModal from '../UserDeleteModal';
import UserBanModal from '../UserBanModal';
import {Button} from 'react-bootstrap';
import load from '../../img/loading.gif';
import {Link} from "react-router-dom";
import Pagination from "react-js-pagination";

class Users extends Component{
    _isMounted = false;
    constructor() {
        super()
        this.state = {
            users: [],
            error: "",
            deleteModalShow:false,
            banModalShow:false,
            userID: "",
            modalUserName: "",
            refetch: false,
            token: 'Bearer '+JSON.parse(localStorage.getItem('login')).token,
            loading: true,
            activePage: 1,
            itemsCountPerPage: 1,
            total: 1
        }
        this.handlePageChange=this.handlePageChange.bind(this)
    }
    componentDidMount(){
        this._isMounted = true;
        axios.get(`/users`, {
            headers: {
                    'Authorization': this.state.token,
                }
        })
            .then(data => {
                this.setState({
                    users: data.data.data,
                    itemsCountPerPage: data.data.per_page,
                    total: data.data.total,
                    loading: false,
                    activePage: data.data.current_page
                })
            })
    }
    handlePageChange(pageNumber) {
        this.setState({loading: true})
        axios.get(`/users?page=${pageNumber}`, {
            headers: {
                    'Authorization': this.state.token,
                }
        })
            .then(data => {
                    this.setState({
                        users: Object.values(data.data.data),
                        itemsCountPerPage: data.data.per_page,
                        total: data.data.total,
                        loading: false,
                        activePage: data.data.current_page
                    })
            })
    }
    componentWillUnmount() {
        this._isMounted = false;
      }
    componentDidUpdate(prevProps){
        if(this.state.refetch == true) {
            axios.get(`/users`, {
                headers: {
                        'Authorization': this.state.token,
                    }
            })
                .then(data => {
                    this.setState({
                        users: data.data.data,
                        loading: false,
                        refetch: false
                    })
                    
                })
            }
    }
    
    
    deleteModalOpen = (id, name) => {
        this.setState({
            deleteModalShow:true,
            userID:id,
            modalUserName: name
    })
    }
    deleteModalClose = () => {
            this.setState({
                deleteModalShow:false
            })
        }
    banModalOpen = (id, name) => {
        this.setState({
            banModalShow:true,
            userID:id,
            modalUserName: name
    })
    }
    banModalClose = () => {
            this.setState({
                banModalShow:false
            })
        }
    delete = () => {
            axios.post(`/user&id=${this.state.userID}/ban/delete`, {deleted: 1, baned: 0}, {
                headers: {
                        'Authorization': this.state.token,
                        'Content-Type': 'application/json',
                    }
            })
            .then(data => {
                this.setState({refetch:true})
                document.querySelector('.error').innerHTML = "<div class=\"alert alert-danger\" role=\"alert\">Ištrintas</div>"
            }).catch(error => {
                console.log(error.response)
          })
            this.deleteModalClose()
        }
    ban = () => {
        axios.post(`/user&id=${this.state.userID}/ban/delete`, {deleted: 0, baned: 1}, {
            headers: {
                    'Authorization': this.state.token,
                    'Content-Type': 'application/json',
                }
        })
        .then(data => {
            this.setState({refetch:true})
            console.log(data)
            document.querySelector('.error').innerHTML = "<div class=\"alert alert-danger\" role=\"alert\">Užblokuotas</div>"
        }).catch(error => {
            console.log(error.response)
        })
        this.banModalClose()
    }
render() {
   let usersList = this.state.users.map(user => ( 
        <tr key={user.id}>
        <th scope="row">{user.id}</th>
        <td>{user.name}</td>
        <td>{user.email}</td>
        <td>{user.location}</td>
        <td>{user.created_at}</td>
        <td><Button variant="danger" onClick={() => this.deleteModalOpen(user.id, user.name)}>
            Pašalinti
        </Button></td>
        <td><Button variant="danger" onClick={() => this.banModalOpen(user.id, user.name)}>
            Užblokuoti
        </Button></td>
        </tr>
        
        ));
    
        if(this.state.loading) {
            return(
                <img className="loading" src={load} alt="loading..." />
            )
        }
    console.log(this.state.users)
    return(
        <div className="Users">
            <div className="main">
                <div className="main-content">
                    <div className="container-fluid">
                        <h1>Vartotojai</h1>
                        <Link to="/banned" className="text-muted">Užblokuoti</Link>
                        <div className="error"></div>
                        <UserDeleteModal
                            delete={()=>this.delete()}
                            userID={this.state.userID}
                            show={this.state.deleteModalShow}
                            onHide={this.deleteModalClose}
                            text={`Jeigu ištrinsite vartotoją bus pašalinti visi įrašai susiję su vartotoju negrįžtamai. Ar tikrai norite ištrinti šį vartotoją? ( ${this.state.modalUserName} )`}
                            token={this.state.token}
                        />
                        <UserBanModal
                            delete={()=>this.ban()}
                            userID={this.state.userID}
                            show={this.state.banModalShow}
                            onHide={this.banModalClose}
                            text={`Ar tikrai norite blokuoti šį vartotoją? ( ${this.state.modalUserName} )`}
                            token={this.state.token}
                        />
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Vardas</th>
                                    <th scope="col">El.Paštas</th>
                                    <th scope="col">Miestas</th>
                                    <th scope="col">Prisiregistravęs</th>
                                    <th scope="col"></th>
                                    <th scope="col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {usersList}
                            </tbody>
                        </table>
                        <div className="d-flex justify-content-center">
                            <Pagination
                                activePage={this.state.activePage}
                                itemsCountPerPage={this.state.itemsCountPerPage}
                                totalItemsCount={this.state.total}
                                pageRangeDisplayed={5}
                                onChange={this.handlePageChange.bind(this)}
                                itemClass="page-item"
                                linkClass="page-link"
                            />
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    )}
}

export default Users;