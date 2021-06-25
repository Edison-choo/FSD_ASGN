module.exports =  {
	checkUser: function(customertype){
		if (customertype == "customer"){
			return true
		}
		else if(customertype == "staff"){
            return false
        }
	},
}