import React from "react";
import ReactDOM from "react-dom";
import App from "../App";
import Navbar from "../components/Navbar";

it("says Navbar", () => {
	const div = document.createElement("div");
	const wrapped = (
		<App>
			<Navbar />
		</App>
	);
	ReactDOM.render(wrapped, div);
	// You stopped here
	// expect(wrapped)
});