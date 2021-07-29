import React, { useState, useEffect } from "react";
import Loader from "react-loader-spinner";
import ReactTooltip from "react-tooltip";

const DEFAULT_TEXT = "Click to copy!";
const TEMPORARY_TEXT = "Room number successfully copied!";

const Room = props => {
	const [tooltipText, setTooltipText] = useState(DEFAULT_TEXT);

	useEffect(() => {
		ReactTooltip.rebuild();
	});

	function copy() {
		navigator.clipboard.writeText(props.room);
		setTooltipText(TEMPORARY_TEXT);
		ReactTooltip.rebuild();
		setTimeout(() => {
			setTooltipText(DEFAULT_TEXT);
			ReactTooltip.rebuild();
		}, 3000);
	}

	if (props.room) {
		return (
			<div className="room">
				<ReactTooltip 
					getContent={[ () => (<span>{tooltipText}</span>), 50 ]}
				/>
				<p>Game Room:</p>
				<h2
					onClick={() => { copy() }}
					data-tip={tooltipText}>
					{props.room}
				</h2>
			</div>
		);
	} else {
		return (
			<div className="room">
				<div className="loading">
					<p>Game Room:</p>
					<Loader type="ThreeDots" color="#FFFFFF" height={80} width={80} />
				</div>
			</div>
		);
	}
}

export default Room;
