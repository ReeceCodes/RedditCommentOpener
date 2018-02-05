function LinksOpen(){
	let comments = document.getElementsByClassName('comments');

	//localsession holds a json object with html, date entries
	let myJSON = JSON.parse(window.localStorage.getItem('RedditCommentOpener')) || [];
	let tempJSON = [];
	let HOURS_24 = 24 * 60 * 60 * 1000;
	let currDate = new Date(); //use the same date for each link

	//this might be a pretty inefficient way but there are likely less than 100 elements at any time (3-ish pages of 30 links within 24 hours)
	//use a temporary array to hold values that are not older than 24 hours, set the original array to the remaining values, rather than figure out removing from the currently looped array
	for (let j = 0; j < myJSON.length; j++)
	{
		let elementDate = new Date(myJSON[j].openDate);
		if (((currDate - elementDate) >= HOURS_24) == false)
		{
			tempJSON.push(myJSON[j]);			
		}
	}
	
	myJSON = tempJSON;

	for (let i = 0; i < comments.length; i++)
	{
		
		let el = comments[i];

		if (el.parentNode.parentNode.previousSibling.getElementsByClassName('stickied-tagline').length == 0) { 
			//add to local storage so that it can be checked against before trying to open again, maybe can incorporate that as an optional thing to do at some day
			//could probably use session storage instead but then going to a new session reopens all instead of just the new links (viewing more than once a day vs once)

			let currString = '{"url" : "' + el.href + '", "openDate" : "' + currDate.toLocaleString("en-US") + '"}';
			
			//check if it was already opened before trying to open, tried using array.includes, array.findIndex, but I could not get any of them to return the correct value, check against full array manually
			let prevOpened = false;						
			for (let k = 0; k < myJSON.length; k++)
			{
				if (myJSON[k].url == el.href)
				{
					prevOpened = true;
				}
			}

			if (prevOpened == false)
			{
				myJSON.push({'url':el.href, 'openDate': currDate.toLocaleString("en-US")});

				window.open(el.href, '_blank');								
			}
		}
	}

	localStorage.setItem("RedditCommentOpener", JSON.stringify(myJSON));

}

LinksOpen();
