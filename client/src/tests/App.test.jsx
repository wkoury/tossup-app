import React from "react";
import ReactDOM from "react-dom";
import Enzyme, { mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { MemoryRouter, Link } from "react-router-dom";
import App from "../App";
import Landing from "../pages/Landing";
import Moderator from "../pages/Moderator";
import Game from "../pages/Game";

Enzyme.configure({ adapter: new Adapter() });

it("renders without crashing", () => {
	const div = document.createElement("div");
	ReactDOM.render(<App />, div);
	ReactDOM.unmountComponentAtNode(div);
});

describe("Routing", () => {

	it("should redirect unknown routes to the landing page", () => {
		const wrapper = mount(
			<MemoryRouter initialEntries={["/adjfladshf"]}>
				<App />
			</MemoryRouter>
		);
		expect(wrapper.find(Landing).length).toEqual(1);
		expect(wrapper.find(Moderator).length).toEqual(0);
	});

	it("should redirect inappropriate moderator visits to the landing page", () => {
		const wrapper = mount(
			<MemoryRouter initialEntries={["/moderator"]}>
				<App />
			</MemoryRouter>
		);
		expect(wrapper.find(Landing).length).toEqual(1);
		expect(wrapper.find(Moderator).length).toEqual(0);
	});

	it("should redirect inappropriate game visits to the landing page", () => {
		const wrapper = mount(
			<MemoryRouter initialEntries={["/game"]}>
				<App />
			</MemoryRouter>
		);
		expect(wrapper.find(Landing).length).toEqual(1);
		expect(wrapper.find(Game).length).toEqual(0);
	});

	it("should render the about page when it is clicked", () => {
		const wrapper = mount(
			<MemoryRouter initalEntries={["/about"]}>
				<App />
			</MemoryRouter>
		);
		expect(wrapper.find(Link).at(2).props().to).toBe('/about');
	});

	it("should render the create page when it is clicked", () => {
		const wrapper = mount(
			<MemoryRouter initalEntries={["/create"]}>
				<App />
			</MemoryRouter>
		);
		expect(wrapper.find(Link).at(1).props().to).toBe('/create');
	});

	it("should render the join page when it is clicked", () => {
		const wrapper = mount(
			<MemoryRouter initalEntries={["/join"]}>
				<App />
			</MemoryRouter>
		);
		expect(wrapper.find(Link).at(0).props().to).toBe('/join');
	});

});
