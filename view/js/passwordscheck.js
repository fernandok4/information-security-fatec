$(document).ready(function()
{	
	$('#password').keyup(function()
	{
		$('#result').html(checkStrength($('#password').val()))
	})	

	document.getElementById('cd_username').value = queryObj().cd_username
});

function verifyAccount(){
	let params = queryObj()
	let isValid = false
	if(checkStrength($('#password').val()) != "Muito curta"){
		let payload = {
			"cd_username": params["cd_username"],
			"ds_token": $('#ds_token').val()
		}
		let headers = {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}
		let result = fetch('http://localhost:3000/verify', {method: 'post', 
		body: JSON.stringify(payload), headers: headers})
		.then(res => res.text())
		.then(text => {
			console.log("TESTEE")
			if(text == "SUCCESS"){
				changePassword(payload, headers)
			}
		})
	}
}

function changePassword(payload, headers){
	payload.ds_password1 = $('#password').val()
	payload.ds_password2 = $('#password2').val()
	fetch('http://localhost:3000/change-password', {method: 'post', 
		body: JSON.stringify(payload), headers: headers}).then(res => res.text())
			.then(text => window.location.href = text)
}

function queryObj() {
	var result = {}, keyValuePairs = location.search.slice(1).split("&");
	keyValuePairs.forEach(function(keyValuePair) {
		keyValuePair = keyValuePair.split('=');
		result[decodeURIComponent(keyValuePair[0])] = decodeURIComponent(keyValuePair[1]) || '';
	});
	return result;
}

function checkStrength(password)
	{
		var strength = 0
		
		if (password.length < 6) { 
			$('#result').removeClass()
			$('#result').addClass('short')
			return 'Muito curta' 
		}
		
		if (password.length > 7) strength += 1
		
		//If password contains both lower and uppercase characters, increase strength value.
		if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/))  strength += 1
		
		//If it has numbers and characters, increase strength value.
		if (password.match(/([a-zA-Z])/) && password.match(/([0-9])/))  strength += 1 
		
		//If it has one special character, increase strength value.
		if (password.match(/([!,%,&,@,#,$,^,*,?,_,~])/))  strength += 1
		
		//if it has two special characters, increase strength value.
		if (password.match(/(.*[!,%,&,@,#,$,^,*,?,_,~].*[!,%,&,@,#,$,^,*,?,_,~])/)) strength += 1
		
		
		//Calculated strength value, we can return messages
		
		
		
		//If value is less than 2
		
		if (strength < 2 )
		{
			$('#result').removeClass()
			$('#result').addClass('weak')
			return 'Fraca'			
		}
		else if (strength == 2 )
		{
			$('#result').removeClass()
			$('#result').addClass('good')
			return 'Boa'		
		}
		else
		{
			$('#result').removeClass()
			$('#result').addClass('strong')
			return 'Forte'
		}
	}