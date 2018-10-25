import React, { Component } from "react";
import { object } from "prop-types";
import Web3 from "web3";
import KittyCoreABI from "../contracts/KittyCoreABI.json";
import { CONTRACT_NAME, CONTRACT_ADDRESS } from "../config";

class Browser extends Component {
  state = {
    currentKitty: undefined,
    kittyInput: ""
  };

  componentDidMount() {
    const web3 = new Web3(window.web3.currentProvider);
    // Initialize the contract instance
    const kittyContract = new web3.eth.Contract(
      KittyCoreABI, // import the contracts's ABI and use it here
      CONTRACT_ADDRESS
    );
    // Add the contract to the drizzle store
    this.context.drizzle.addContract({
      contractName: CONTRACT_NAME,
      web3Contract: kittyContract
    });
  }

  getKittyInfo = () => {
    const contract = this.context.drizzle.contracts[CONTRACT_NAME];
    // TODO- await/async into method
    // TODO- add validation so people can't send empty string and crash the program
    console.log(contract);
    // get Kitty method call
    contract.methods
      .getKitty(this.state.kittyInput)
      .call()
      .then(result => {
        this.setState({
          currentKitty: result
        });
      });
  };

  setInput = e => {
    // add in e validation
    this.setState({ kittyInput: e.target.value });
  };

  render() {
    return (
      <div className="browser">
        <h1>The CryptoKitty Whisperer</h1>

        {/* Input to type in the kitty ID here */}
        <React.Fragment>
          <label> Add your kitty id here: </label>
          <input value={this.state.kittyInput} onChange={this.setInput} />
          <button onClick={this.getKittyInfo}> Find my kitty breh </button>
        </React.Fragment>
        {/* Display Kitty info here */}
        {this.state.currentKitty && (
          <React.Fragment>
            <p> Genes: {this.state.currentKitty.genes}</p>
            <p> Birth Time: {this.state.currentKitty.birthTime}</p>
            <p> Generation: {this.state.currentKitty.generation}</p>
          </React.Fragment>
        )}
      </div>
    );
  }
}

Browser.contextTypes = {
  drizzle: object
};

export default Browser;
