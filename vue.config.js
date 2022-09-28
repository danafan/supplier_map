module.exports = {	
	devServer: {
		proxy: {
			'/admin': {
				target: 'http://supply.92nu.com',
				ws: true,
				changOlrigin: true,		
			}
		},
		host:"0.0.0.0",  
	}
}