var MobileSelect = function(configArray) {

	var self      = this;

	this.items    = configArray.items;
	this.config   = configArray.config;

	var new_items = [];

	// This will run automatically.
	var init = function() {

		for (var i = 0; i < self.items.length; i++) {

			new_items = [];

			var sel = getSelect(i);
			$(self.items[i].item).prepend(sel);
		}

		// listen for selection and navigate to url on change
		$("." + self.config.className + " select").change(function() {

			var href = $(this).find("option:selected").val();

			if(href !== "") window.location = href;
		});
	};

	/**
	 * Creates the HTML <select>
	 * @param  {number} index     The index of the config array items
	 * @return {html select}      Will return ready markup for select
	 */
	var getSelect = function(index){

		var config    = self.items[index];
		var title     = config.title !== undefined ? config.title : "Select";
		var item      = config.item;

		// if item is not found, return
		if(!$(item)[0]) return;

		var link_array     = [];
		var items          = cleanUpLevels(listChildren($(item)));
		var options        = [];

		for (var i = 0; i < items.length; i++) {
			var add = "";
			for (var k = 0; k < items[i].level; k++) { add += "-"; }
			var text = add + " " +items[i].text;
			items[i].text = text;
		}

		return getSelectMarkup(title, items);
	};

	/**
	 * Creates the html for the select
	 * @param  {string} title The first item in the select
	 * @param  {array} items
	 * @return {[type]}  Returns markup
	 */
	var getSelectMarkup = function(title, items){
		var content = "<div class='" + self.config.className + "'><select>";

			content += "<option value=''>";
			content += title;
			content += "</option>";

			for (var i = 0; i < items.length; i++) {
				content += "<option value='" + items[i].href + "'>";
				content += items[i].text;
				content += "</option>";
			}

			content += "</select></div>";

		return content;
	};


	var listChildren = function(item) {
		var level = 0;

		// Start the recursive child loop
		getChildren($(item), level);

		return new_items;
	};

	/**
	 * Get children of the current elem
	 * @param  {[type]} item  jquery dom element
	 * @param  {[type]} level how deep we are in the chain
	 */
	var getChildren = function(item, level) {

		level++;

		// Loop through all children
		$(item).children().each(function(){

			// get children of this item
			getChildren($(this), level);

			// Add class to item, so we can hide it on mobile
			$(this).addClass(self.config.replaceClassName);

			// If this item is a link, add it to the new_items array
			// which we will use for the select
			if($(this).attr('href'))
			{
				new_items.push({
					level: level,
					text: $(this).text(),
					href: $(this).attr('href'),
					obj: $(this)
				});
			}
		});
	};


	var cleanUpLevels = function(items) {

		var levels = [];

		// Make array of different leves that have links
		for (var h = 0; h < items.length; h++) {
			if(!levels[items[h].level]) levels[items[h].level] = "";
		}

		// Map levels so, that we don't have any empty levels
		// Lowest level will be 0 and next level that
		// have links in it will be 1 and so on
		var l       = 0;
		var what    = [];
		var becomes = [];
		for(var t in levels) {
			what.push(t);
			becomes.push(l);
			l++;
		}

		// Change the levels of the items to correlate to relative levels
		for (var y = 0; y < items.length; y++) {
			for (var w = 0; w < what.length; w++) {
				if(items[y].level == what[w]) {
					items[y].level = becomes[w];
				}
			}
		}

		return items;
	};


	init();
};