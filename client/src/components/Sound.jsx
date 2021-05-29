import React from "react";
import Sound from 'react-sound';
import useSound from 'use-sound';
import buzzerSound from "../assets/ding.mp3";

const Sound = props => {

	const [play] = useSound(buzzerSound);

	return (
		<Sound
			url={buzzerSound}
			playStatus={Sound.status.PLAYING}
		/>
	);
}

export default Sound;
