/*
The schema we are following

Please update this every time change anything, it will make our lives easier
in the future.

TODO:
	Turn this into a script that just validates the schema- that way it can be
	documetation and verification
*/


// users collection
{
	_id: "some objectID" //
	email: "foo@bar.com", // a unique key
	account_status: "active" or "inactive",
	password_hash: "fjslflsfsjlk" // need to talk to victoria about this
}

// posture_data collection
{
	user_email: "foo@bar.ca",
	period_length: "snapshot" or "day", // we plan to condense the data later
	measurements: [
		{
			period_end_timestamp: "some standard timestamp (todo)",
			position_class: "good" or "bad", // there will be more classes later
		}
	]
}
