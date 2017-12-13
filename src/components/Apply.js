import React, { Component } from 'react'
import { handleChange } from '../services/FormService'
import request from '../services/Net'
import NotificationSystem from 'react-notification-system'

export default class Apply extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            firstname: '',
            email: '',
            phone: '',
            linkedin: '',
            presentation: '',
            type: '1',
            cv: '',
            success: false
        }
    }

    apply(e) {
        e.preventDefault();
        const dataset = new FormData();
        dataset.append('name', this.state.name);
        dataset.append('firstname', this.state.firstname);
        dataset.append('email', this.state.email);
        dataset.append('phone', this.state.phone);
        dataset.append('linkedin', this.state.linkedin);
        dataset.append('presentation', this.state.presentation);
        dataset.append('type', this.state.type);
        if (document.getElementById("cv").files[0]) {
            dataset.append('cv', document.getElementById("cv").files[0]);
        }
        request({
            url: '/contact/apply',
            method: 'post',
            data: dataset
        }, this.refs.notif).then((res) => {
            this.setState({
                name: '',
                firstname: '',
                email: '',
                phone: '',
                linkedin: '',
                presentation: '',
                type: '1',
                cv: '',
                success: true
            })
        })
    }

    render () {
        return (
            <div className="container">
                <NotificationSystem ref="notif" />
                <div className="row justify-content-center">
                    <div className="col-lg-6 col-md-10 col-sm-12">
                        <h2 className="text-center my-4">CARRIÈRES : N’HÉSITEZ PLUS, REJOIGNEZ NOUS 🙂</h2>
                        <p>Vous aimez l’aventure, vous avez de l’ambition et vous êtes ultra motivé ! Pas de doute, vous êtes la pierre angulaire de notre future team.
                            <br /><br />
À votre clavier, le formulaire ci-dessous vous attend ! </p>
                        <form onSubmit={this.apply.bind(this)} className="mt-4">
                            <div className="form-group">
                                <input type="text" value={this.state.name} onChange={handleChange.bind(this)} placeholder="Votre nom *" name="name" className="form-control"/>
                            </div>
                            <div className="form-group">
                                <input type="text" value={this.state.firstname} onChange={handleChange.bind(this)} placeholder="Votre prenom *" name="firstname" className="form-control"/>
                            </div>
                            <div className="form-group">
                                <input type="text" value={this.state.email} onChange={handleChange.bind(this)} placeholder="Votre email *" name="email" className="form-control"/>
                            </div>
                            <div className="form-group">
                                <input type="text" value={this.state.phone} onChange={handleChange.bind(this)} placeholder="Votre numero de telephone *" name="phone" className="form-control"/>
                            </div>
                            <div className="form-group">
                                <input type="text" value={this.state.linkedin} onChange={handleChange.bind(this)} placeholder="Lien vers votre compte LinkedIn" name="linkedin" className="form-control"/>
                            </div>
                            <div className="form-group">
        						<label>Joindre votre CV</label>
        						<label htmlFor="cv" className={(this.state.cv)?'active-upload':'upload'} style={{ position: 'relative' }}>
        							<input type="file" className="form-control" id="cv" onChange={() => { this.setState({ cv : document.getElementById("cv").files[0].name }) }} style={{ position: 'absolute', height: '5.5em', top: '0', left: "0", opacity: '0.0001'}}/>
        							Glisser votre CV ici ou cliquez pour en séléctionner un parmi vos fichers<br/>
                                {(this.state.cv)?'Selectionné : '+this.state.cv:"Aucun fichier séléctionné"}
        						</label>
        					</div>
                            <fieldset className="form-group">
                                <legend>Type d'embauche</legend>
                                <div className="form-check">
                                    <label className="form-check-label">
                                        <input type="radio" name="type" className="form-check-input" onChange={handleChange.bind(this)} checked={(this.state.type === '1')?true:false} value="1" /> Stage en communication / commercialisation
                                        </label>
                                    </div>
                                    <div className="form-check">
                                        <label className="form-check-label">
                                            <input type="radio" name="type" className="form-check-input" onChange={handleChange.bind(this)} checked={(this.state.type === '2')?true:false} value="2" /> Stage en community management / business development
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <label className="form-check-label">
                                                <input type="radio" name="type" className="form-check-input" onChange={handleChange.bind(this)} checked={(this.state.type === '3')?true:false} value="3" /> Candidature spontanée
                                                </label>
                                            </div>
                                        </fieldset>
                            <div className="form-group">
                                <textarea value={this.state.presentation} rows="10" onChange={handleChange.bind(this)} placeholder="C'est à vous. Présentez-vous rapidement et donnez nous envie de vous rappeler ! *" name="presentation" className="form-control"/>
                            </div>
                            {this.state.success &&
                            <p className="alert alert-success">Votre candidature a ete envoyee avec succes</p>}
                            <button className="btn btn-primary mb-4">Envoyer</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}