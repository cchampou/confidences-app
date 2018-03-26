
import React, { Component } from 'react'
import request from '../../../services/Net'
import NotificationSystem from 'react-notification-system'
import { handleChange } from '../../../services/FormService'
import Loading from '../../utils/Loading'
import { Redirect } from 'react-router-dom'
import { logout } from '../../../services/AuthService'
import Confirm from '../../utils/Confirm'
import ReactGA from 'react-ga';
import Meta from '../../utils/Meta'
import FontAwesome from 'react-fontawesome'
import FileUpload from '../../utils/FileUpload'
import Address from '../../utils/Address'

export default class CompanyManageInfos extends Component {

	constructor(props) {
		super(props)
		this.state = {
			logout: false,
			password: '',
			conf: '',
			loadLogo: false
		}
		this.getState = this.getState.bind(this);
	}

	componentDidMount() {
		this.get();
	}

	get() {
		request({
			url : '/user/me',
			method : 'get',
		}, this.refs.notif).then((res) => {
			this.setState({
				user : res,
				email: res.email,
				phone: res.phone
			});
			res.addresses.map((address) => {
				if (address.type === 1) {
					this.setState({
						bid: address.id,
						bsexe_m: address.sexe_m?'1':'0',
						baddress1: address.line1,
						baddress2: address.line2,
						baddress3: address.line3,
						baddress4: address.line4,
						bzip: address.zipcode,
						bcity: address.city,
						bcountry: address.country
					})
				}
				if (address.type === 2) {
					this.setState({
						did: address.id,
						dsexe_m: address.sexe_m?'1':'0',
						daddress1: address.line1,
						daddress2: address.line2,
						daddress3: address.line3,
						daddress4: address.line4,
						dzip: address.zipcode,
						dcity: address.city,
						dcountry: address.country,
						dphone: address.phone
					})
				}
			})
		});
	}

	deleteAccount() {
		request({
			url: '/user',
			method: 'delete'
		}, this.refs.notif).then((res) => {
			logout();
			this.setState({
				logout: true
			})
		})
	}

	changeInfos(e) {
		e.preventDefault()
		request({
			url: '/user',
			method: 'put',
			data: {
				phone: this.state.phone,
				email: this.state.email
			}
		}, this.refs.notif).then((res) => {
			this.setState({
				editInfos: false
			})
		})
	}

	uploadLogo(e) {
		e.preventDefault();
		if (document.getElementById("HQlogo").files[0]) {
			this.setState({ loadLogo: true });
			const data = new FormData();
			data.append('HQlogo', document.getElementById('HQlogo').files[0]);
			request({
				url: '/user',
				method: 'put',
				data: data
			}, this.refs.notif).then((res) => {
				setTimeout(() => {
					this.props.update();
				}, 500);
				this.setState({ loadLogo: false });
			});
		}
	}

	getState(_objState) {
		console.log(_objState.name);
		this.setState(_objState);
	}

	render () {
		return (
			<div>
			<Meta title="Mes informations"/>
			{this.state.logout && <Redirect to="/" />}
				<NotificationSystem ref="notif" />
				<div className="row mt-5">
					<div className="col">
						<h2 className="text-center">
							Mes informations
						</h2>
						<h3>Mon logo</h3>
						<form onSubmit={this.uploadLogo.bind(this)}>
							<FileUpload identifier="HQlogo" loading={this.state.loadLogo} label="Merci d'uploader un fichier de bonne qualité (nous en avons besoin pour la plaque que nous posons sur la ruche). Recommandations : 1200 x 1200px, 2mo maximum. Utilisez le format PNG si votre logo contient des zones ou un fond transparent." accept="image/*"/>
							<div className="form-group text-center">
								<button className="btn btn-secondary">Envoyer le logo</button>
							</div>
						</form>
					</div>
				</div>
				{(this.state.user)?

					<div>
						<div className="row">
							<div className="col-lg-6 col-sm-12">
								<h3 className="text-center"><small>Mes informations</small></h3>
							</div>
						</div>
						<div className="row">
							<div className="col-lg-6 col-sm-12">
							{(!this.state.editInfos)?
								<div>
									<strong>Entreprise :</strong> {this.state.user.company_name}<br />
									<strong>Siret :</strong> {this.state.user.siret}<br />
									<strong>Nom :</strong> {this.state.user.name}<br />
									<strong>Prénom :</strong> {this.state.user.firstname}<br />
									<strong>Numéro de téléphone :</strong> {this.state.phone}<br />
									<strong>Email :</strong> {this.state.email}<br /><br />
									<button className="btn btn-secondary btn-sm pull-right" onClick={() => {
										this.setState({ editInfos: true
											})
										}}>
										<FontAwesome name="pencil" />&nbsp;Editer ces informations
									</button>
								</div>
								:
								<form onSubmit={this.changeInfos.bind(this)}>
									<div className="form-group">
										<label>Numéro de téléphone</label>
										<input type="tel" name="phone" onChange={handleChange.bind(this)} value={this.state.phone} className="form-control form-control-sm" placeholder="Numéro de téléphone" />
									</div>
									<div className="form-group">
										<label>Email</label>
										<input type="email" name="email" onChange={handleChange.bind(this)} value={this.state.email} className="form-control form-control-sm" placeholder="Email" />
									</div>
									<div className="form-group text-center">
										<button className="btn btn-primary">Enregistrer</button>
									</div>
								</form>
							}
							</div>
						</div>

					</div>
					:null}

					<div className="row">
						<div className="col-lg-6 col-sm-12">
							<h3 className="text-center my-4"><small>Mon adresse de facturation</small></h3>
							{(!this.state.editBaddress)?
								<div>
									{this.state.baddress2}<br />
									{this.state.bsexe_m === '0'?'Mme. ':'M. '}{this.state.baddress1}<br />
									{this.state.baddress3}<br />
									{(this.state.baddress4)?this.state.baddress4:null}
									{this.state.baddress4 && <br />}
									{this.state.bzip} {this.state.bcity}<br />
									{this.state.bcountry}<br /><br />
								<button className="btn btn-secondary btn-sm pull-right" onClick={() => { this.setState({ editBaddress: true })}}><FontAwesome name="pencil" />&nbsp;Editer ces informations</button>
								</div>
							:
							<Address fnct={true} type={1} var={'editBaddress'} functionDefault={this.getState} textButton={'Sauvegarder'}/>
						}
						</div>

						<div className="col-lg-6 col-sm-12">
							<h3 className="text-center my-4"><small>Mes informations de livraison</small></h3>
							{(!this.state.editDaddress)?
								<div>
									{this.state.dsexe_m === '0'?'Mme. ':'M. '}{this.state.daddress1}<br />
									{this.state.daddress3}<br />
									{(this.state.daddress4)?this.state.daddress4:null}
									{this.state.daddress4 && <br />}
									{this.state.dzip} {this.state.dcity}<br />
									{this.state.dcountry}<br />
									<strong>Téléphone pour la livraison :</strong> {this.state.dphone}
									<br /><br />
									<button className="btn btn-secondary btn-sm pull-right" onClick={() => {
											this.setState({ editDaddress: true
											})
										}}>
										<FontAwesome name="pencil" />&nbsp;Editer ces informations
									</button>
								</div>
								:
								<Address fnct={true} type={2} var={'editDaddress'} functionDefault={this.getState} textButton={'Sauvegarder'}/>
							}
						</div>
					</div>
				</div>
		);
	}
}
