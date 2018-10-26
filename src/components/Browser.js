import React, { Component } from "react";
import { object } from "prop-types";
import Web3 from "web3";
import KittyCoreABI from "../contracts/KittyCoreABI.json";
import { CONTRACT_NAME, CONTRACT_ADDRESS } from "../config";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";

// sup with my coding brethren
// im building up cryptomob- CRYPTOMOB.NET
// hit me up to build on it !

//TODO- destructure components
class Browser extends Component {
  state = {
    currentKitty: undefined,
    currentKittyAPI: undefined,
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
    // TODO- add validation that it must be numbers
    // get Kitty method call
    contract.methods
      .getKitty(this.state.kittyInput)
      .call()
      .then(result => {
        this.setState({
          currentKitty: result
        });
      });

    fetch(`https://api.cryptokitties.co/kitties/${this.state.kittyInput}`)
      .then(results => {
        //TODO- add error code driven if statement
        if (results.status === 400) return null;
        else return results.json();
      })
      .then(results => this.setState({ currentKittyAPI: results }));
  };

  setInput = e => {
    // add in e validation
    const acceptedValues = new RegExp("^([0-9])*$");
    if (e.target.value.match(acceptedValues))
      this.setState({ kittyInput: e.target.value });
    else alert("values must only be numbers!");
  };

  randomKitty = () => {
    const number = Math.floor(Math.random() * 1000000);
    this.setState({ kittyInput: String(number) });
    this.getKittyInfo();
  };

  render() {
    // destructuring adds readability
    const { currentKitty, currentKittyAPI } = this.state;

    const name = currentKittyAPI
      ? currentKittyAPI.name ||
        (currentKittyAPI.sire
          ? currentKittyAPI.sire.name
          : "no one for I have no name") ||
        "no one for I have no name"
      : "";
    return (
      <div className="browser">
        <h1>The CryptoKitty Whisperer</h1>

        {/* Input to type in the kitty ID here */}
        <React.Fragment>
          <Grid container direction="row">
            <Grid item xs={12}>
              <TextField
                label="Add your Kitty Id Here"
                value={this.state.kittyInput}
                onChange={this.setInput}
                margin="normal"
              />
            </Grid>
            <div style={{ marginTop: "1rem" }} />{" "}
            {/* TODO- abstract this into a scss file and import css  */}
            <Grid item xs={12}>
              <Button
                variant="outlined"
                color="primary"
                onClick={this.getKittyInfo}
              >
                {" "}
                Find my kitty breh{" "}
              </Button>
              <div style={{ marginTop: "1rem" }} />
              <Button
                variant="outlined"
                color="primary"
                onClick={this.randomKitty}
              >
                {" "}
                I can haz random kitty
              </Button>
            </Grid>
          </Grid>
        </React.Fragment>
        {/* Display Kitty info here */}
        {currentKittyAPI && (
          <React.Fragment>
            <img
              src={currentKittyAPI.image_url_png}
              width={420}
              alt={"kitty image"}
            />
            {name && <p> Meet {name} </p>}
          </React.Fragment>
        )}
        {currentKitty && (
          <React.Fragment>
            <p> Genes: {currentKitty.genes}</p>
            <p> Birth Time: {currentKitty.birthTime}</p>
            <p> Generation: {currentKitty.generation}</p>
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
