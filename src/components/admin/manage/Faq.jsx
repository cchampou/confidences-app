import React, { Component } from 'react';
import Input from '@cda/input';
import Button from '@cda/button';

import request from '../../../services/Net';
import { handleChange } from '../../../services/FormService';
import Loading from '../../utils/Loading';
import { withNotification } from '../../../services/withNotification';

export default withNotification(class AdminManageFaq extends Component {
  state = {
    items : null,
    newQuestion: '',
    newAnswer: '',
    type: ''
  };

  componentDidMount() {
    this.getQA();
  }

  getQA() {
    const { notification } = this.props;
    request({
      url : '/faq',
      method : 'get',
    }, notification).then((res) => {
      this.setState({ items : res });
    });
  }

  delete(id) {
    const { notification } = this.props;
    request({
      url: `/faq/${id}`,
      method: 'delete',
    }, notification).then(() => {
      this.getQA();
    });
  }

  addQA (e) {
    e.preventDefault();
    const { notification } = this.props;
    request({
      url : '/faq',
      method : 'post',
      data : {
        question : this.state.newQuestion,
        answer : this.state.newAnswer,
        type : this.state.type,
      }
    }, notification).then(() => {
      this.getQA()
      this.setState({
        newQuestion: '',
        newAnswer: '',
        type: ''
      });
    })
  }

  render () {
    return  (
      <div className="row">
        <div className="col">
          <h2>Gerer la FAQ</h2>
          <form>
            <h3>Ajouter une question / réponse</h3>
            <Input type="text" placeholder="Question" name="newQuestion" value={this.state.newQuestion} onChange={handleChange.bind(this)} />
            <textarea className="form-control" placeholder="Réponse" name="newAnswer" value={this.state.newAnswer} onChange={handleChange.bind(this)} />
            <select className="form-control" name="type" value={this.state.type} onChange={handleChange.bind(this)}>
              <option value="0">Cible</option>
              <option value="1">Général</option>
              <option value="2">Entreprise</option>
              <option value="3">Particulier</option>
              <option value="4">Apporteur d'affaire</option>
            </select>
            <Button type="submit" onClick={this.addQA.bind(this)}>Ajouter</Button>
          </form>
          {this.state.items?
          <table className="table">
            <tbody>
              {this.state.items.map((item) => {
                return (<tr key={item.id}><td>{item.question}</td><td><button onClick={this.delete.bind(this, item.id)} className="btn btn-primary btn-sm">Supprimer</button></td></tr>)
              })}
            </tbody>
          </table>
          :<Loading />}
        </div>
      </div>
    )
  }
});
