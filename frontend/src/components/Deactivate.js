import React from 'react';
import UserPool from '../UserPool';
import axios from 'axios';
import aws from 'aws-sdk';

function Deactivate() {
	var bp = require('./Path');
	var _ud = localStorage.getItem('user_data');
	var ud = JSON.parse(_ud);
	// eslint-disable-next-line
	var objectId = ud.id;
	var firstName = ud.firstName;
	var email = ud.email;

	const doDeactivate = async () => {
		// AMAZON COGNITO - needs email/ username and userPoolId
		const user = UserPool.getCurrentUser();
		const userName = user.getUsername();

		const deleteData = {
			Username: userName,
			UserPoolId: 'us-east-2_34v9YRHja',
		};

		// cognito.adminDeleteUser(deleteData, (err, data) => {
		// 	if (err) {
		// 		console.error(err);
		// 		return;
		// 	}

		// 	// On success store user into DB
		// 	const userToDeactivate = {
		// 		userId: objectId,
		// 	};
		// 	var userToDeactivatejson = JSON.stringify(userToDeactivate);

		// 	var config = {
		// 		method: 'delete',
		// 		url: bp.buildPath('api/deactivate/' + objectId),
		// 		headers: {
		// 			'Content-Type': 'application/json',
		// 		},
		// 		data: userToDeactivatejson,
		// 	};

		// 	axios(config)
		// 		.then(function (response) {
		// 			var res = response.data;

		// 			if (res.error) {
		// 				console.log('error');
		// 			} else {
		// 				window.location.href = '/';
		// 			}
		// 		})
		// 		.catch(function (error) {
		// 			console.log(error);
		// 		});
		// });
	};

	return (
		<div id='deactivateDiv'>
			<br />
			<button
				type='button'
				id='deactivateButton'
				class='buttons'
				onClick={doDeactivate}
			>
				Deactivate
			</button>
		</div>
	);
}

export default Deactivate;
