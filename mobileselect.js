var MobileSelect = function(configArray) {

	var self = this;

	this.config = configArray;
	var new_items = [];

	// This will run automatically.
	var init = function() {

		for (var i = 0; i < self.config.items.length; i++) {

			new_items = [];

			var sel = getSelect(i);
			$(self.config.items[i].item).prepend(sel);
		}

		// listen for selection and navigate to url on change
		$("." + self.config.config.className + " select").change(function() {

			var href = $(this).find("option:selected").val();

			if(href !== "") window.location = href;
		});
	};



	var getSelect = function(index){

		var config    = self.config.items[index];
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

	var getSelectMarkup = function(title, items){
		var content = "<div class='" + self.config.config.className + "'><select>";

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
		getChildren($(item), level);

		return new_items;
	};

	var getChildren = function(item, level) {

		level++;

		$(item).children().each(function(){

			getChildren($(this), level);

			$(this).addClass(self.config.config.replaceClassName);

			if($(this).attr('href'))
			{
				new_items.push({level: level, text: $(this).text(), href: $(this).attr('href'), obj: $(this)});
			}
		});
	};

	var getOptions = function(item) {

		var option = "";

		$(item).find('a').each(function(index) {
			// This should never happen, but if this link has
			// already been replaced, don't do it again
			if($(this).hasClass(self.config.config.replaceClassName)) return;

			option += "<option value='" + $(this).attr('href') + "'>";
			option += $(this).text();
			option += "</option>";

			$(this).addClass(self.config.config.replaceClassName);
		});

		return option;
	};

	var cleanUpLevels = function(items) {

		var levels = [];

		// Make array of different leves that have links
		for (var h = 0; h < items.length; h++) {
			if(!levels[items[h].level]) levels[items[h].level] = "";
		}

		// Map levels so, that we don't have any empty levels
		// Lowest level will be 0 and next level that have links in it will be 1 and so on
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


var log = function(message){ console.log(message); };