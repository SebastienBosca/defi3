import React, { Component } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Table from 'react-bootstrap/Table';
import Voting from "./contracts/Voting.json";
import getWeb3 from "./getWeb3";
import "./App.css";

class App extends Component {
  state = { web3: null, accounts: null, contract: null, list_voters: null };

  componentWillMount = async () => {
    try {
      // Récupérer le provider web3
      const web3 = await getWeb3();
  
      // Utiliser web3 pour récupérer les comptes de l’utilisateur (MetaMask dans notre cas) 
      const accounts = await web3.eth.getAccounts();

      // Récupérer l’instance du smart contract “Voting” avec web3 et les informations du déploiement du fichier (client/src/contracts/Voting.json)
      const deployedNetwork = Voting.networks[3];
  
      const instance = new web3.eth.Contract(
        Voting.abi,
        "0xDc8dE5dB6D8b8cbdAF1DCB28e4192beDD442892a",
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runInit);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Non-Ethereum browser detected. Can you please try to install MetaMask before starting.`,
      );
      console.error(error);
    }
  };

  runInit = async() => {
    const { accounts, contract } = this.state;
  
    // récupérer la liste des comptes enregistrés pour le vote
    const list_voters = await contract.methods.RegVoters.call;
    // Mettre à jour le state 
    this.setState({ list_voters: list_voters });
  }; 

  voting = async() => {
    const { accounts, contract } = this.state;
    const vAddress = this.vAddress.value;
    
    // Interaction avec le smart contract pour enregistrer un votant 
    await contract.methods.Register(vAddress).send({from: accounts[0]});
    // Récupérer la liste des comptes autorisés
    this.runInit();
  }
 

  render() {
    const { list_voters } = this.state;
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <div>
            <h2 className="text-center">Système de vote décentralisé</h2>
            <hr></hr>
            <br></br>
        </div>
        <div style={{display: 'flex', justifyContent: 'center'}}>
          <Card style={{ width: '50rem' }}>
            <Card.Header><strong>Liste des votants enregistrés</strong></Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>@</th>
                      </tr>
                    </thead>
                    <tbody>
                      {list_voters !== null && 
                        list_voters.map((a) => <tr><td>{a}</td></tr>)
                      }
                    </tbody>
                  </Table>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </div>
        <br></br>
        <div style={{display: 'flex', justifyContent: 'center'}}>
          <Card style={{ width: '50rem' }}>
            <Card.Header><strong>Ajouter un votant</strong></Card.Header>
            <Card.Body>
              <Form.Group controlId="formAddress">
                <Form.Control type="text" id="vAddress"
                ref={(input) => { this.vAddress = input }}
                />
              </Form.Group>
              <Button onClick={ this.list_voters } variant="dark" > Autoriser </Button>
            </Card.Body>
          </Card>
          </div>
        <br></br>
      </div>
    );
  }
}

export default App;
