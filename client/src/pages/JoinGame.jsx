import React from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { withRouter } from "react-router-dom";

class JoinGame extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			room: "",
			name: "",
		};

		this.handleChange = this.handleChange.bind(this);
	}

	handleChange = event => {
		event.preventDefault();
		this.setState({
			[event.target.name]: event.target.value
		});
	}

	handleLogin = (event) => {
		event.preventDefault();

		if (this.state.name.length >= 25) {
			alert("The name you entered is too long!");
			this.setState({
				name: ""
			});
			return;
		}

		if (this.state.room !== "" && this.state.name !== "") {
			axios.get(`/api/rooms/${this.state.room}`).then(res => {
				if (res.data === "DNE") {
					alert("That room does not exist!");
					this.setState({
						room: ""
					});
					return false;
				} else {

					this.props.setName(this.state.name);
					this.props.setRoom(this.state.room);

					const roomLink = "/game";
					this.props.history.push(roomLink);
				}
			});
		}
	}

	render() {
		return (
			<React.Fragment>
				<Navbar />
				<div className="App">
					<div className="initialization">
						<h4>Enter your room ID & name:</h4>
						<div className="form-fields">
							<form>
								<input
									className="room-input"
									type="text"
									inputMode="numeric"
									placeholder="Room"
									name="room"
									autocomplete="off"
									maxLength={6}
									value={this.state.room}
									onChange={e => this.handleChange(e)}
								></input>
								<br></br>
								<input
									className="name-input"
									type="text"
									placeholder="Name"
									maxLength={25}
									name="name"
									autocomplete="off"
									value={this.state.name}
									onChange={e => this.handleChange(e)}
								></input>
								<div>
									<button
										className="name-submit"
										onClick={(e) => this.handleLogin(e)}
									>
										Join
                                        </button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

export default withRouter(JoinGame);
