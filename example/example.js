var addMobileNav = function(){
	var mobile_config = {
		config: {
			className: 'mobile_nav',
			replaceClassName: 'mobile_select_replace'
		},

		items: [{
				item: '#main-navigation',
				title: "Menu"
			},
			{
				item: '.anchor-links',
				title: 'Jump to...'
		}]
	};

	var mn = new MobileSelect(mobile_config);
};

$(document).ready(function(){
	addMobileNav();
});