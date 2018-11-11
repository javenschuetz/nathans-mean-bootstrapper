# The schema we are following

## very messy so far, it will be nicer later

users collection
{
	_id: "some objectID" //
	email: "foo@bar.com", // a unique key
	account_status: "active" or "inactive",
	password_hash: "fjslflsfsjlk" // need to talk to victoria about this
}

posture_data collection
{
	user_email: "foo@bar.ca",
	// to make the data easy to condense over time
	// could use week or month long-term, but this should be fine for now
	period_length: "snapshot" or "day",
	measurements: [
		{
			period_end_timestamp: "some standard timestamp (todo)",
			position_class: "good" or "bad", // there will be more classes later
		}
	]
}
